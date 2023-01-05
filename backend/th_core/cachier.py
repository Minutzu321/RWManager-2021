import logging
from django.core.cache import cache


INDICIU_KEY = "indicii."
INDICII_KEY = "indicii"


ECHIPA_KEY = "echipe."
ECHIPE_KEY = "echipe"

STATII_KEY = "statii."
STATIE_KEY = "statii"

PLINE_KEY = "pline"

SETARE_KEY = "setare"

EXPIRA = 60 * 60 * 2 #2 ore

def loadIndicii(force=False):
    if not cache.get(INDICII_KEY) or force:
        from ..models import Indiciu
        lista = [o.pk for o in Indiciu.objects.all()]
        cache.set(INDICII_KEY, lista, EXPIRA)

def updateIndiciu(indiciu, nou):
    if nou:
        loadIndicii(force=True)
    else:
        cache.set(INDICIU_KEY+str(indiciu.pk), indiciu, EXPIRA)

def getIndiciu(pk):
    loadIndicii()
    from ..models import Indiciu
    gt = cache.get(INDICIU_KEY+str(pk))
    if gt:
        return gt
    else:
        try:
            gtrk = Indiciu.objects.get(pk=pk)
            cache.set(INDICIU_KEY+str(pk), gtrk, EXPIRA)
            return gtrk
        except:
            return None

def getIndicii():
    loadIndicii()
    return [getIndiciu(o) for o in cache.get(INDICII_KEY)]







def loadEchipe(force=False):
    if not cache.get(ECHIPE_KEY) or force:
        from ..models import GrupTH
        lista = [o.sid for o in GrupTH.objects.all()]
        cache.set(ECHIPE_KEY, lista, EXPIRA)

def updateEchipa(echipa, nou):
    if nou:
        loadEchipe(force=True)
    else:
        cache.set(ECHIPA_KEY+str(echipa.sid), echipa, EXPIRA)

def getEchipa(sid):
    loadEchipe()
    from ..models import GrupTH
    gt = cache.get(ECHIPA_KEY+str(sid))
    if gt:
        return gt
    else:
        try:
            gtrk = GrupTH.objects.get(sid=sid)
            cache.set(ECHIPA_KEY+str(sid), gtrk, EXPIRA)
            return gtrk
        except:
            return None

def getEchipe():
    loadEchipe()
    return [getEchipa(o) for o in cache.get(ECHIPE_KEY)]






def loadStatii(force=False):
    if not cache.get(STATII_KEY) or force:
        from ..models import Statie
        lista = [o.st_sid for o in Statie.objects.all()]
        cache.set(STATII_KEY, lista, EXPIRA)

def updateStatie(statie, nou):
    if nou:
        loadStatii(force=True)
    else:
        cache.set(STATIE_KEY+str(statie.st_sid), statie, EXPIRA)

def getStatie(sid):
    loadStatii()
    from ..models import Statie
    gt = cache.get(STATIE_KEY+str(sid))
    if gt:
        return gt
    else:
        try:
            gtrk = Statie.objects.get(st_sid=sid)
            cache.set(STATIE_KEY+str(sid), gtrk, EXPIRA)
            return gtrk
        except:
            return None

def getStatii():
    loadStatii()
    return [getStatie(o) for o in cache.get(STATII_KEY)]

def resetSetare():
    from ..models import TreasureHuntSettings
    cache.set(SETARE_KEY, TreasureHuntSettings.objects.first(), EXPIRA)
    from ..comenzi import executa_th
    for grup in getEchipe():
        executa_th("welcome", grup, [])

def getSetare():
    from ..models import TreasureHuntSettings
    ck = cache.get(SETARE_KEY)
    if ck:
        return ck
    else:
        try:
            iss = TreasureHuntSettings.objects.first()
            cache.set(SETARE_KEY, iss, EXPIRA)
            return iss
        except:
            return None