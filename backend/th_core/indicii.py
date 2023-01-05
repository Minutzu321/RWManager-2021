from backend.th_core.cachier import getIndicii, getEchipe
from datetime import timezone
import haversine as hs
from haversine.haversine import Unit
import unidecode
import logging

from cdifflib import CSequenceMatcher

pline = []

def indiciuToJS(indiciu):
    return {
        "pk": indiciu.pk,
        "indiciu": True,
        "lat": indiciu.locatie.lat,
        "lng": indiciu.locatie.lon,
        "text": indiciu.text,
        "poza": indiciu.poza.url if indiciu.arataPoza else None,
        "harta": indiciu.arataLocatie
    }

def statieToJS(statie):
    return {
        "pk": 0,
        "indiciu": False,
        "lat": statie.locatie.lat,
        "lng": statie.locatie.lon,
        "text": "Ati fost repartizati la statia de voluntari de pe harta. Va rugam sa va indreptati catre punctul marcat.",
        "poza": None,
        "harta": True
    }

def similar(a, b):
    return CSequenceMatcher(None, a, b).ratio()
def normalizeString(s):
    s = str(s).strip()
    s = unidecode.unidecode(s)
    s = s.lower()
    s = s.replace(".","")
    s = s.replace("-","")
    s = s.replace("_","")
    s = s.replace("?","")
    s = s.replace("!","")
    s = s.replace("%","")
    s = s.replace("(","")
    s = s.replace(")","")
    s = s.replace(",","")
    s = s.replace(":","")
    s = s.replace("un ","")
    s = s.replace("o ","")
    s = s.replace(" lei","")
    s = s.replace(" euro","")
    return s

def raspuns(requester, rasp):
    indiciuMeta = requester.indicii.last()

    requester.incercari += rasp
    
    if indiciuMeta.rezolvat or indiciuMeta.sarit:
        from ..utils import trimite_comanda_th
        trimite_comanda_th(str(requester.sid), "alege", getBlocate(requester))
        return (False, "Se cauta un nou indiciu..")
    rasp = normalizeString(rasp)
    adv = normalizeString(indiciuMeta.indiciu.rasp)
    da = False
    if similar(rasp,adv) > 0.65:
        da = True

    if len(adv) >= 3 and adv in rasp:
        da = True
    

    if da:
        if indiciuMeta.indiciu.echipe > 0:
            indiciuMeta.indiciu.echipe -= 1
            indiciuMeta.indiciu.save()
        eIndiciuLiber(indiciuMeta.indiciu)
        indiciuMeta.rezolvat = True
        indiciuMeta.save()
        return (True, "")
    return (False, "Raspuns incorect.")
    
def skip(requester):
    if requester.platite > 0:
        requester.platite -= 1
        indiciuMeta = requester.indicii.last()
        if indiciuMeta.indiciu.echipe > 0:
            indiciuMeta.indiciu.echipe -= 1
            indiciuMeta.indiciu.save()
        eIndiciuLiber(indiciuMeta.indiciu)
        indiciuMeta.sarit = True
        indiciuMeta.save()
        requester.save()
        return True
    return False


def primulIndiciu(requester):
    from ..models import IndiciuMeta
    from .cachier import getIndicii
    loc=(float(requester.locatie.lat), float(requester.locatie.lon))
    best = None
    best_m = 1000000
    for indiciu in getIndicii():
        loc2=(float(indiciu.locatie.lat), float(indiciu.locatie.lon))
        rz = hs.haversine(loc, loc2, unit=Unit.METERS)
        if rz < best_m:
            if eIndiciuLiber(indiciu):
                best = indiciu
                best_m = rz
        
    if best:
        best.echipe+=1
        best.save()
        return IndiciuMeta.objects.create(indiciu=best)
    else:
        from ..utils import sendNotif
        sendNotif("EROARE FATALA", "Nu mai sunt indicii, TABULA RASA")
        return None
    
def getPline():
    pline = []
    for o in getIndicii():
        if not eIndiciuLiber(o): pline.append(o.pk)
    return pline

def getBlocate(requester):
    pline = []
    dirt = []
    for o in getIndicii():
        if requester.directie == 0 and o.green:
            dirt.append(o.pk)
        if requester.directie == 1 and o.extremitate:
            dirt.append(o.pk)
        if requester.directie == 2 and o.centru:
            dirt.append(o.pk)
        if not eIndiciuLiber(o): pline.append(o.pk)
    for indiciumeta in requester.indicii.all():
        pline.append(indiciumeta.indiciu.pk)
    pline.pop()
    return [pline, dirt]
    

def eIndiciuLiber(indiciu):
    r = indiciu.echipe < indiciu.echipe_simultan
    return r

def getTTS(requester, prima=False):
    indiciumeta = requester.indicii.last()
    if not indiciumeta:
        indiciumeta = primulIndiciu(requester)
        requester.indicii.add(indiciumeta)
        return indiciuToJS(indiciumeta.indiciu)
    if not prima:
        if indiciumeta.rezolvat or indiciumeta.sarit:
            from ..utils import trimite_comanda_th
            trimite_comanda_th(str(requester.sid), "alege", getBlocate(requester))
    return indiciuToJS(indiciumeta.indiciu)



def getRanks():
    ranks = []
    for grup in getEchipe():
        inds = 0
        for o in grup.indicii.all():
            if o.rezolvat:
                inds += 1
        ranks.append({
            "nume": grup.nume,
            "inds": inds,
            "dif": grup.dificultate
        })
    return ranks