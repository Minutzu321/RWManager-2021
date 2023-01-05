from backend.utils.ip import get_client_ip
import requests
import logging
import json
# from .basic import cookie_protocol
from ..utils import emailValid, telefonValid, dataValida, sendNotif
from django.http import JsonResponse 
from ..models import Rol, User, Rezervare
from django.http.response import HttpResponseBadRequest

def getRoluri(request):
    if request.method == 'POST':
        lista = []
        for rol in Rol.objects.all():
            if rol.id_aplica != -1:
                lista.append({
                    "id": rol.id_aplica,
                    "display": rol.nume_display
                })
        return JsonResponse({"vals": lista})
    return HttpResponseBadRequest()

def registerProtocol(request):
    if request.method == 'POST':
        jsonb = json.loads(request.body)
        if jsonb['captcha']:
                req = {
                    'secret': '6LcZQekUAAAAALVxmZ9xizl2thEkiALdObxkgCgZ',
                    'response': jsonb['captcha']
                }
                captcha = requests.post(url = "https://www.google.com/recaptcha/api/siteverify", data = req).text
                if json.loads(captcha)["success"]:
                    ip = get_client_ip(request)
                    nume = jsonb['nume'].strip()
                    email = jsonb['email'].strip()
                    if not emailValid:
                        return JsonResponse({"raspuns":"Email-ul nu este valid."})
                    telefon = jsonb['telefon'].strip()
                    if not telefonValid(telefon):
                        return JsonResponse({"raspuns":"Numarul de telefon nu este valid."})
                    nastere = jsonb['nastere'].strip()
                    data_nastere = dataValida(nastere)
                    if not data_nastere:
                        return JsonResponse({"raspuns":"Data nasterii nu este valida. Asigura-te ca o scrii in formatul zz/ll/aaaa"})
                    try:
                        rol = Rol.objects.get(id_aplica=jsonb['rol'])
                        try:
                            User.objects.get(email=email)
                            return JsonResponse({"raspuns":"Email-ul este deja inregistrat. Intra pe ro049.com/login si logheaza-te."})
                        except:
                            pass
                        try:
                            User.objects.get(telefon=telefon)
                            return JsonResponse({"raspuns":"Numarul de telefon este deja inregistrat. Intra pe ro049.com/login si logheaza-te cu email-ul."})
                        except:
                            pass
                        try:
                            c = 0
                            for u in User.objects.filter(status=0):
                                try:
                                    u.ips.get(ip=ip)
                                    if c < 2:
                                        c+=1
                                    else:
                                        return JsonResponse({"raspuns":"Deja ai aplicat pentru un rol de cateva ori."})
                                except Exception as e:
                                    logging.info(e)
                        except Exception as e:
                            logging.info(e)

                        rasp = JsonResponse({"raspuns":"Multumim pentru implicare! Contul a fost inregistrat iar cererea va fi analizata. Vei primi in scurt timp un raspuns pe email."})
                        # cook = cookie_protocol(request, ip, rasp)
                        # if cook:
                        u = User(nume=nume, email=email, telefon=telefon, rol=rol, data_nastere=data_nastere)
                        u.save()
                        u.ips.create(ip=ip)
                        # u.cookies.add(cook)
                        rasp.set_cookie('riverwolves_user', u.logid, max_age=60*60*24*31*18)
                        sendNotif(nume, rol.nume_display+" "+jsonb['nastere'].strip())
                        return rasp
                        # else:
                        #     return JsonResponse({"raspuns":"A aparut o eroare. Te rugam da refresh la pagina."})
                    except Exception as e:
                        return JsonResponse({"raspuns":"Rolul la care ai aplicat nu exista."})
        return JsonResponse({"raspuns":"Te rugam bifeaza casuta 'Nu sunt robot'"})
    return HttpResponseBadRequest()

def loginProtocol(request):
    if request.method == 'POST':
        jsonb = json.loads(request.body)
        if jsonb['captcha']:
                req = {
                    'secret': '6LcZQekUAAAAALVxmZ9xizl2thEkiALdObxkgCgZ',
                    'response': jsonb['captcha']
                }
                captcha = requests.post(url = "https://www.google.com/recaptcha/api/siteverify", data = req).text
                if json.loads(captcha)["success"]:
                    ip = get_client_ip(request)
                    s = jsonb['rwu']
                    try:
                        u = User.objects.get(sid=s)
                        if u.status == 0:
                            return JsonResponse({"raspuns":"Contul tau nu a fost acceptat inca.", "redir": False})
                        rasp = JsonResponse({"raspuns":"Acceptat!", "redir": True})
                        # cook = cookie_protocol(request, ip, rasp)
                        # if cook:
                        #     if not cook in u.cookies.all():
                        #         u.cookies.add(cook)
                        rasp.set_cookie('riverwolves_user', u.logid, max_age=60*60*24*31*18)
                        sendNotif(u.nume, "S-a logat")
                        return rasp
                        # else:
                        #     return JsonResponse({"raspuns":"A aparut o problema. Te rugam da refresh la pagina.", "redir": False})
                    except Exception as e:
                        logging.info(e)
                        return JsonResponse({"raspuns":"ID-ul nu exista.", "redir": False})
        return JsonResponse({"raspuns":"Te rugam bifeaza casuta 'Nu sunt robot", "redir": False})
    return HttpResponseBadRequest()

def rezerva(request):
    if request.method == 'POST':
        # jsonb = json.loads(request.body)
        # if jsonb['captcha']:
        #         req = {
        #             'secret': '6LcZQekUAAAAALVxmZ9xizl2thEkiALdObxkgCgZ',
        #             'response': jsonb['captcha']
        #         }
        #         captcha = requests.post(url = "https://www.google.com/recaptcha/api/siteverify", data = req).text
        #         if json.loads(captcha)["success"]:
        #             ip = get_client_ip(request)
        #             tel = jsonb['tel']
        #             nume = jsonb['nume']
        #             part = int(jsonb['part'])
        #             if len(Rezervare.objects.all()) >= 80:
        #                 return JsonResponse({"raspuns":"S-a atins limita rezervarilor.", "err": True})
        #             try:
        #                 Rezervare.objects.get(ip=ip)
        #                 return JsonResponse({"raspuns":"Deja ai facut o rezervare.", "err": True})
        #             except: pass
        #             try:
        #                 Rezervare.objects.get(telefon=tel)
        #                 return JsonResponse({"raspuns":"Deja s-a facut o rezervare pe acest numar de telefon", "err": True})
        #             except Exception as e:
        #                 r = Rezervare(nume=nume, telefon=tel, persoane=part, ip=ip)
        #                 r.save()
        #                 sendNotif("Rezervare", nume+" - "+str(part))
        #                 return JsonResponse({"raspuns":"Biletele au fost rezervate! Va asteptam pe 12 Septembrie la Casa Avramide pana in ora 17.", "err": False})
        return JsonResponse({"raspuns":"Rezervarile au fost inchise.", "err": True})
    return HttpResponseBadRequest()