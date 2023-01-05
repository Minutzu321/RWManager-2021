from backend.th_core.indicii import getBlocate, getRanks
from django.utils import timezone
from backend.th_core.graf import getGraf
from .clasa import Comanda
from ..utils import trimite_comanda_th
import logging
from ..th_core import getStart, getEnd, aInceput, aTerminat, getSetare, primulIndiciu

comenzi_th = []


class WelcomeCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "welcome"

    def executa(self, requester, argumente):
        try:
            #starting
            if not getSetare().inceput and not getSetare().terminat:
                indiciumeta = requester.indicii.last()
                if indiciumeta:
                    from ..utils import punctRandom
                    lat, lng = punctRandom(float(indiciumeta.indiciu.locatie.lat), float(indiciumeta.indiciu.locatie.lon))
                    trimite_comanda_th(str(requester.sid), "status", [0, requester.nume, getStart(), getGraf(), requester.platite, requester.conditii, True, lat, lng])
                else:
                    trimite_comanda_th(str(requester.sid), "status", [0, requester.nume, getStart(), getGraf(), requester.platite, requester.conditii, False])
            
            #inceput
            if getSetare().inceput and not getSetare().terminat:
                from ..th_core import getTTS
                trimite_comanda_th(str(requester.sid), "status", [1, requester.nume, getEnd(), getGraf(), requester.platite, requester.conditii, getTTS(requester, prima=True)])
                indiciumeta = requester.indicii.last()
                if indiciumeta.rezolvat or indiciumeta.sarit:
                    
                    trimite_comanda_th(str(requester.sid), "alege", getBlocate(requester))
            
            #sfarsit
            if getSetare().inceput and getSetare().terminat:
                trimite_comanda_th(str(requester.sid), "status", [2, requester.nume, getRanks()])
        except Exception as e:
            logging.exception(e)
        return None

class PingCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "ping"

    def executa(self, requester, argumente):
        try:
            if not getSetare().inceput and aInceput():
                seta = getSetare()
                seta.inceput = True
                seta.save()
            if not getSetare().terminat and aTerminat():
                seta = getSetare()
                seta.terminat = True
                seta.save()

            
            #updateaza locatia
            loc = requester.locatie
            if loc:
                loc.acc = argumente[0]
                vit = argumente[1]
                if not vit:
                    vit = -1
                if vit > 20:
                    requester.alerte += "Viteza "+str(vit)
                loc.viteza = vit
                loc.lat = argumente[2]
                loc.lon = argumente[3]
                loc.ora_data = timezone.now()
                requester.locatie.save()
            else:
                from ..models import Locatie
                vit = argumente[1]
                if not vit:
                    vit = -1
                if vit > 20:
                    requester.alerte += "Viteza "+str(vit)
                loc = Locatie.objects.create(lat=argumente[2], lon=argumente[3], acc=argumente[0], viteza=vit)
                requester.locatie = loc
                requester.save()

            if len(requester.indicii.all()) == 0:
                from ..th_core import primulIndiciu
                indiciu = primulIndiciu(requester)
                requester.indicii.add(indiciu)
                requester.save()
                executa_th("welcome", requester, [])
            trimite_comanda_th(str(requester.sid), "uok", ["sunt ochei"])
            
        except Exception as e:
            logging.exception(e)
        return None

class AcceptCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "accept"

    def executa(self, requester, argumente):
        try:
            requester.conditii = True
            requester.save()
            executa_th("welcome", requester, [])
        except Exception as e:
            logging.exception(e)
        return None


class RaspunsCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "raspuns"

    def executa(self, requester, argumente):
        try:
            from ..th_core import raspuns, getBlocate
            pas, err = raspuns(requester, argumente)
            if pas:
                trimite_comanda_th(str(requester.sid), "modal", ["Corect! Se alege urmatorul indiciu.."])

                trimite_comanda_th(str(requester.sid), "alege", getBlocate(requester))
            else:
                trimite_comanda_th(str(requester.sid), "modal", [err])
        except Exception as e:
            logging.exception(e)
        return None

class SkipCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "skip"

    def executa(self, requester, argumente):
        try:
            from ..th_core import skip, getBlocate
            if skip(requester):
                trimite_comanda_th(str(requester.sid), "modal", ["Se alege urmatorul indiciu.."])
                
                trimite_comanda_th(str(requester.sid), "alege", getBlocate(requester))
            else:
                trimite_comanda_th(str(requester.sid), "modal", ["Nu mai ai skip-uri"])
        except Exception as e:
            logging.exception(e)
        return None

class SendTTSCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "sendtts"

    def executa(self, requester, argumente):
        try:
            from ..th_core import getTTS
            trimite_comanda_th(str(requester.sid), "tts", [requester.platite, getTTS(requester)])
        except Exception as e:
            logging.exception(e)
        return None

class AlegCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "aleeg"

    def executa(self, requester, argumente):
        # from .indiciu
        try:
            indiciuMeta = requester.indicii.last()
            if indiciuMeta and (indiciuMeta.rezolvat or indiciuMeta.sarit):
                indiciu = primulIndiciu(requester)
                requester.indicii.add(indiciu)
                requester.save()
                if argumente == 0:
                    if requester.directie == 3:
                        requester.directie = 0
                    else:
                        requester.directie += 1
                    requester.save()
                    trimite_comanda_th(str(requester.sid), "alege", getBlocate(requester))
                    return

                from ..th_core import eIndiciuLiber, getIndiciu
                from ..models import IndiciuMeta
                i = getIndiciu(argumente)
                if i:
                    if eIndiciuLiber(i):
                        if i.green:
                            requester.directie = 1
                            requester.save()
                        if i.extremitate:
                            requester.directie = 0
                            requester.save()
                        imeta = IndiciuMeta.objects.create(indiciu=i)
                        requester.indicii.add(imeta)
                        from ..th_core import getTTS
                        trimite_comanda_th(str(requester.sid), "tts", [requester.platite, getTTS(requester)])
                    else:
                        if i.green or i.extremitate or i.centru:
                            if requester.directie == 3:
                                requester.directie = 0
                            else:
                                requester.directie += 1
                            requester.save()
                        
                        trimite_comanda_th(str(requester.sid), "alege", getBlocate(requester))
                    

                
        except Exception as e:
            logging.exception(e)
        return None


def initializeaza_th():
    global comenzi_th
    comenzi_th.append(WelcomeCmd())
    comenzi_th.append(AcceptCmd())
    comenzi_th.append(PingCmd())
    comenzi_th.append(RaspunsCmd())
    comenzi_th.append(SkipCmd())
    comenzi_th.append(SendTTSCmd())
    comenzi_th.append(AlegCmd())

def executa_th(comanda, requester, argumente, web=False):
    global comenzi_th
    if not comenzi_th:
        initializeaza_th()
    for cmd in comenzi_th:
        if cmd.getComanda().lower() == comanda.lower():
            if (web and cmd.isWeb()) or not web:
                cmd.executa(requester, argumente)