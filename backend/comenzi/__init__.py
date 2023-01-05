from django.utils import timezone
from backend.models import Rezervare
from backend.utils.contact import sendEmailHTML
from .clasa import Comanda
from ..utils import trimite_comanda_rw, trimite_comanda_th
from .th_cmd import executa_th
import logging
import base64
import random

from django.core.files.base import ContentFile
from django.core.files.images import ImageFile


def getUserJson(requester, user):
    if (requester.rol.permisiune >= 10):
        if user.rol.permisiune < 10:
            return {
                "id": user.pk,
                "nume": user.nume,
                "online": user.online,
                "nick": user.nick,
                "email": user.email,
                "rookie": user.rookie,
                "perm": user.rol.permisiune,
                "rol": user.rol.nume_display,
                "data_inregistrare": user.data_inregistrare.strftime("%d/%m/%Y"),
                "data_nastere": user.data_nastere.strftime("%d/%m/%Y"),
                "telefon": user.telefon,
                "activitate": user.activitate,
                "incredere": user.incredere,
                "status": user.status,
            }
        else:
            return {
                "id": user.pk,
                "nume": user.nume,
                "online": user.online,
                "nick": user.nick,
                "email": user.email,
                "rookie": user.rookie,
                "perm": user.rol.permisiune,
                "rol": user.rol.nume_display,
                "data_inregistrare": user.data_inregistrare.strftime("%d/%m/%Y"),
                "data_nastere": user.data_nastere.strftime("%d/%m/%Y"),
                "telefon": user.telefon,
                "status": user.status,
            }
    else:
        if user.rol.permisiune < 10:
            return {
                "id": user.pk,
                "nume": user.nume,
                "online": user.online,
                "nick": user.nick,
                "email": user.email,
                "rookie": user.rookie,
                "perm": user.rol.permisiune,
                "rol": user.rol.nume_display,
                "data_inregistrare": user.data_inregistrare.strftime("%d/%m/%Y"),
                "data_nastere": user.data_nastere.strftime("%d/%m/%Y"),
            }
        else:
            return {
                "id": user.pk,
                "nume": user.nume,
                "online": user.online,
                "nick": user.nick,
                "email": user.email,
                "rookie": user.rookie,
                "perm": user.rol.permisiune,
                "rol": user.rol.nume_display,
                "data_inregistrare": user.data_inregistrare.strftime("%d/%m/%Y"),
                "data_nastere": user.data_nastere.strftime("%d/%m/%Y"),
                "telefon": user.telefon,
            }

comenzi = []

#comanda "sunt/nu sunt online". Ea trimite tuturor userilor online un semnal ca si requesterul este/nu este online
class OnlineCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "online"

    def executa(self, requester, argumente):
        from backend.models import User
        try:
            for user in User.objects.filter(online=True):
                trimite_comanda_rw(str(user.chat_room), "online", [requester.pk, argumente[0]])
        except Exception as e:
            logging.info(e)
        return None

class UpdateMembruCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "update_membru"

    def executa(self, requester, argumente):
        from backend.models import User
        try:
            for user in User.objects.filter(online=True):
                executa("membri", user, None)
                # trimite_comanda_rw(str(user.chat_room), "update_membru", getUserJson(user, requester))
        except Exception as e:
            logging.info(e)
        return None

class SendMembriCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "membri"

    def executa(self, requester, argumente):
        from backend.models import User
        try:
            useri = []
            for user in User.objects.all():
                if user.status == 1:
                    useri.append(getUserJson(requester, user))
                elif requester.rol.permisiune >= 80:
                    useri.append(getUserJson(requester, user))
            trimite_comanda_rw(str(requester.chat_room), "membri", useri)
        except Exception as e:
            logging.info(e)
        return None

class AcceptaCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "accept"

    def executa(self, requester, argumente):
        from backend.models import User
        try:
            if requester.rol.permisiune >= 80:
                target = User.objects.get(pk=argumente[0])
                acceptat = argumente[1]
                if acceptat:
                    target.status = 1
                    target.save()
                    
                    sendEmailHTML("Bine ai venit in echipa River Wolves", [target.email], "Cererea ta a fost acceptata.", "Bine ai venit in echipa!", "Pentru a te loga in panoul echipei, apasa pe butonul de mai jos.", "LOGHEAZA-TE", "https://ro049.com/login?riverwolves_id="+str(target.sid))
                else:
                    target.status = 2
                    target.save()
                    sendEmailHTML("Status rol in echipa River Wolves", [target.email], "Cererea ta a fost refuzata.", "", "Din pacate, echipa nu mai poate primi membri. Te rugam sa incerci sezonul urmator.")
            
        except Exception as e:
            logging.info(e)
        return None

class AddIndiciuCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "add_indiciu"

    def executa(self, requester, argumente):
        from backend.models import Locatie, Indiciu
        try:
            if requester.rol.permisiune >= 80 or requester.incredere >= 80:
                format, imgstr = argumente[11].split(';base64,') 
                ext = format.split('/')[-1] 
                data = ContentFile(base64.b64decode(imgstr), name='indiciu.' + ext)

                text = argumente[0]
                rasp = argumente[1]


                acc = argumente[6]
                vit = argumente[7]
                if not vit:
                    vit = -1
                hed = argumente[8]
                if not hed:
                    hed = -1
                lat = argumente[9]
                lng = argumente[10]

                locatie = Locatie.objects.create(lat=lat, lon=lng, acc=acc, viteza=vit, directie=hed)
                arataLocatie = argumente[4]
                arataPoza = argumente[5]
                dificultate = argumente[2]
                echipe_simultan = argumente[3]
                adugat_de = requester.nume
                Indiciu.objects.create(text=text, rasp=rasp, locatie=locatie, poza=data, arataLocatie=arataLocatie,
                    arataPoza=arataPoza, dificultate = dificultate, echipe_simultan=echipe_simultan, adugat_de=adugat_de, status=0)
        except Exception as e:
            logging.info(e)
        return None

class SendIndiciiCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "send_indicii"

    def executa(self, requester, argumente):
        from backend.models import Indiciu
        try:
            indicii = []
            for indiciu in Indiciu.objects.all():
                indicii.append({
                    "text": indiciu.text,
                    "rasp": indiciu.rasp,
                    "acc": indiciu.locatie.acc,
                    "lat": indiciu.locatie.lat,
                    "lng": indiciu.locatie.lon,
                    "poza": indiciu.poza.url,
                    "aloc": indiciu.arataLocatie,
                    "apoz": indiciu.arataPoza,
                    "dif": indiciu.dificultate,
                    "ech": indiciu.echipe_simultan,
                    "adaugat_de": indiciu.adugat_de,
                    "status": indiciu.status
                })
            trimite_comanda_rw(str(requester.chat_room), "send_indicii", indicii)
        except Exception as e:
            logging.info(e)
        return None

class UpdateIndiciuCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "update_indiciu"

    def executa(self, requester, argumente):
        from backend.models import User
        try:
            for user in User.objects.filter(online=True):
                if user.rol.permisiune >= 80 or user.incredere >= 80:
                    executa("send_indicii", user, None)
                # trimite_comanda_rw(str(user.chat_room), "update_membru", getUserJson(user, requester))
        except Exception as e:
            logging.info(e)
        return None

class SendRezervareCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "send_rezervare"

    def executa(self, requester, argumente):
        try:
            if requester.rol.permisiune >= 80 or requester.incredere >= 80:
                rezervari = []
                for rezervare in Rezervare.objects.all():
                    rezervari.append({
                        "nume": rezervare.nume,
                        "tel": rezervare.telefon,
                        "pers": rezervare.persoane,
                    })
                trimite_comanda_rw(str(requester.chat_room), "send_rezervari", rezervari)
        except Exception as e:
            logging.info(e)
        return None

class SendRezervariCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "send_rezervari"

    def executa(self, requester, argumente):
        from backend.models import User
        try:
            for user in User.objects.filter(online=True):
                executa("send_rezervare", user, None)
        except Exception as e:
            logging.info(e)
        return None

class AdaugaEchipaCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "adauga_echipa"

    def executa(self, requester, argumente):
        from backend.models import GrupTH
        nume = argumente[0].strip()
        tel = argumente[1].strip()
        pers = argumente[2]
        dif = argumente[3]
        green = argumente[4]
        skips = argumente[5]
        if len(Rezervare.objects.all()) >= 80:
            trimite_comanda_rw(str(requester.chat_room), "send_qr", ["0", "NU SE MAI ACCEPTA REZERVARI!"])
            return
        try:
            e = GrupTH.objects.get(telefon=tel)
            trimite_comanda_rw(str(requester.chat_room), "send_qr", [str(e.sid), e.nume+" (Deja inregistrat)"])
        except Exception as e:
            reen = 0
            xtremitati = 0
            for rup in GrupTH.objects.all():
                if rup.directie == 0:
                    reen += 1
                if rup.directie == 1:
                    xtremitati += 1
            dir = 0
            if reen > 19:
                dir = 1

            e = GrupTH.objects.create(nume=nume, telefon=tel, persoane=pers, dificultate=dif, greenGym=green, directie=dir, platite=skips)
            trimite_comanda_rw(str(requester.chat_room), "send_qr", [str(e.sid), e.nume])


class CautaEchipeCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "cauta_echipe"

    def executa(self, requester, argumente):
        from ..th_core import getStatii, getEchipe
        from ..utils import getDistanta
        for statie in getStatii():
            for user in statie.useri.all():
                if str(user.sid) == str(requester.sid):
                    deja = [str(o.sid) for o in statie.au_fost.all()]
                    potentiale = []
                    for echipa in getEchipe():
                        if echipa.online and not echipa.inStatie and echipa.locatie and not str(echipa.sid) in deja:
                            dif = timezone.localtime(echipa.locatie.ora_data) - timezone.localtime(timezone.now())
                            if dif.total_seconds() <= 30 and getDistanta(statie.locatie, echipa.locatie) < 300:
                                dif2 = timezone.localtime(echipa.lastStatie) - timezone.localtime(timezone.now())
                                if echipa.fostStatie:
                                    if dif2.total_seconds() > 60*20:
                                        potentiale.append(echipa)
                                else:
                                    potentiale.append(echipa)
                    if len(potentiale) >= 2:
                        alese = random.choices(potentiale, k=2)
                        statie.echipe.set(alese)
                        for ec in alese:
                            ec.inStatie = True
                            ec.save()
                            executa_th("sendtts", ec, [])

                    



class SendStatieCmd(Comanda):
    def isWeb(self):
        return False

    def getComanda(self):
        return "send_statie"

    def executa(self, requester, argumente):
        if len(argumente[0].echipe.all()) == 2:
            trimite_comanda_rw(str(requester.chat_room), "send_statie", [argumente[0].echipe.first().nume+" "+argumente[0].echipe.first().telefon, argumente[0].echipe.last().nume+" "+argumente[0].echipe.last().telefon])
        else:
            trimite_comanda_rw(str(requester.chat_room), "send_statie", [])

class CastigatorCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "castigator"

    def executa(self, requester, argumente):
        from ..th_core import getStatii
        for statie in getStatii():
            for user in statie.useri.all():
                if str(user.sid) == str(requester.sid):
                    castig = None
                    pierd = None
                    if argumente == 1:
                        castig = statie.echipe.first()
                        pierd = statie.echipe.last()
                    if argumente == 2:
                        castig = statie.echipe.last()
                        pierd = statie.echipe.first()
                    if castig:
                        castig.platite += 1
                        castig.inStatie = False
                        castig.fostStatie = True
                        castig.lastStatie = timezone.now()
                        castig.save()
                    if pierd:
                        pierd.inStatie = False
                        pierd.fostStatie = True
                        pierd.lastStatie = timezone.now()
                        pierd.save()
                    
                    from ..comenzi import executa_th
                    executa_th("sendtts", pierd, [])
                    executa_th("sendtts", castig, [])

                    statie.echipe.clear()
                    statie.au_fost.add(castig)
                    statie.au_fost.add(pierd)

                        

class LocatieCmd(Comanda):
    def isWeb(self):
        return True

    def getComanda(self):
        return "loc"

    def executa(self, requester, argumente):
        from backend.models import Locatie
        from ..th_core import getStatii
        for statie in getStatii():
            for user in statie.useri.all():
                if str(user.sid) == str(requester.sid):
                    loc = statie.locatie
                    if loc:
                        if argumente[0] < 50:
                            loc.acc = argumente[0]
                            loc.lat = argumente[1]
                            loc.lon = argumente[2]
                            loc.ora_data = timezone.now()
                            loc.save()
                    else:
                        loc = Locatie.objects.create(lat=argumente[1], lon=argumente[2], acc=argumente[0])
                        statie.locatie = loc
                        statie.save()

        pass

def initializeaza():
    global comenzi
    comenzi.append(OnlineCmd())
    comenzi.append(SendMembriCmd())
    comenzi.append(UpdateMembruCmd())
    comenzi.append(AcceptaCmd())
    comenzi.append(AddIndiciuCmd())
    comenzi.append(SendIndiciiCmd())
    comenzi.append(UpdateIndiciuCmd())
    comenzi.append(SendRezervariCmd())
    comenzi.append(SendRezervareCmd())
    comenzi.append(AdaugaEchipaCmd())
    comenzi.append(CautaEchipeCmd())
    comenzi.append(SendStatieCmd())
    comenzi.append(CastigatorCmd())
    comenzi.append(LocatieCmd())

def executa(comanda, requester, argumente, web=False):
    global comenzi
    if not comenzi:
        initializeaza()
    for cmd in comenzi:
        if cmd.getComanda().lower() == comanda.lower():
            if (web and cmd.isWeb()) or not web:
                cmd.executa(requester, argumente)