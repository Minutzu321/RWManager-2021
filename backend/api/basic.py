from datetime import datetime
from django.http.response import HttpResponseBadRequest
from django.shortcuts import redirect
from django.http import JsonResponse 
from django.core.cache import cache
import logging
import json
from ..models import Obiecte, User, Setari, Rol
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.cache import cache_page
from django.utils import timezone
from ..utils import sendNotif, ip_romania, get_client_ip

#PROTOCOALE
#protocolul asigura cookieurile de tracking asupra tuturor
# def cookie_protocol(request, ip, raspuns):
#     if not ip_romania(ip):
#         return None
#     #se iau datele browserului de la dispozitivul care acceseaza
#     user_agent = request.META['HTTP_USER_AGENT']

#     #se ia cookie-ul de sesiune(actually tracking cookie)
#     cookie = request.COOKIES.get('riverwolves_session') 

#     #se verifica daca exista sau nu
#     if cookie:
#         #exista cookie
#         try:
#             #exista obiectul in baza de date
#             c = Cookie.objects.get(sid=cookie)
#             c.ora_data = timezone.now()
#             c.save()
#             return c
#         except:
#             #obiectul nu exista in baza de date, de unde l-a luat userul? dubios
#             raspuns.delete_cookie('riverwolves_session')
#             return None
#     else:
#         #nu exista cookie
#         #se verifica obiectul in baza de date
#         existaIP = None
#         for cookieVerif in Cookie.objects.all():
#             try:
#                 cookieVerif.metadate.get(ip=ip)
#                 cookieVerif.ora_data = timezone.now()
#                 cookieVerif.save()
#                 existaIP=cookieVerif
#                 break
#             except:
#                 pass
#         if existaIP:
#             cookieObject = existaIP
#         else:
#             cookieObject = Cookie()
#             cookieObject.save()
#         cookieObject.metadate.create(ip=ip, user_agent=user_agent)
#         raspuns.set_cookie('riverwolves_session', cookieObject.sid, max_age=60*60*24*31*18)
#         return cookieObject


#protocolul asigura trackingul si securitatea userului
# def user_protocol(request, cookie):
#     user_cookie = request.COOKIES.get('riverwolves_user')
#     if user_cookie and cookie:
#         rw_user = User.objects.get(logid=user_cookie)
#         ckie = rw_user.cookies.get(sid=cookie.sid)
#         if ckie:
#             return rw_user
#     return None


@ensure_csrf_cookie
def setup(request):
    ip = get_client_ip(request)

    # raspuns = redirect(request.GET['intoarce'])
    co = None
    if ip_romania(ip):
        # co = cookie_protocol(request, ip, raspuns)
        #daca userul are deja un cookie care este invalid, il stergem si dam refresh la pagina ca sa facem unul nou
        # if not co:
        # raspuns.delete_cookie('riverwolves_session')
        pass
    # user = user_protocol(request, co)
    # if not user and request.COOKIES.get('riverwolves_user') :
    #     rasp = redirect('/')
    #     rasp.delete_cookie('riverwolves_user')
    #     return rasp
    return JsonResponse({"e": "ok"})
# from django.views.decorators.csrf import csrf_exempt

# @ensure_csrf_cookie
def suntRecrutari(request):
    if request.method == 'POST':
        b = None
        for setare in Setari.objects.all():
            if b and setare.prioritate > b.prioritate:
                b = setare
            elif not b:
                b = setare
        if b:
            return JsonResponse({"raspuns": b.recrutari})
        else:
            return JsonResponse({"raspuns": True})
    return HttpResponseBadRequest()

from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def obiecte(request):
    if request.method == 'POST':
        acum = timezone.now()
        
        for obj in Obiecte.objects.all():
            s1 = obj.start1 - acum
            s2 = obj.start2 - acum
            s3 = obj.start3 - acum
            indicii = ["<h4><b>1.</b>Parter - 1941 ________________________ de la origini pana in prezent</h4>",
                        "<h4><b>2.</b>Dupa tabla din clasa celor 3 coordonatori</h4>",
                        "<h4><b>3.</b>Sub Grigore Moisil</h4>",
                        "<h4><b>4.</b>Sub o casuta roz de la 1. Sau poate magenta??</h4>",
                        "<h4><b>5.</b>https://drive.google.com/file/d/1Rl8NIrEffLwmoVeZ-ezQseGDRMOEvd8D/view?usp=sharing</h4>"
                        ]
            if obj.carte: indicii[0] = "<h4>1. Indiciu rezolvat</h4>"
            if obj.tabla: indicii[1] = "<h4>2. Indiciu rezolvat</h4>"
            if obj.moisil: indicii[2] = "<h4>3. Indiciu rezolvat</h4>"
            if obj.casa: indicii[3] = "<h4>4. Indiciu rezolvat</h4>"
            if obj.piatra: indicii[4] = "<h4>5. Indiciu rezolvat</h4>"

            if obj.start1 > acum:
                mes = "<h1>Primele doua indicii se vor posta la ora 09:50</h1>"
                return JsonResponse({"t": s1.seconds, "mes": mes})
            elif obj.start2 > acum:
                mes = "<h1>Urmatorul indiciu se va posta la ora 13:00</h1>"
                for i in range(2):
                    mes += indicii[i]
                return JsonResponse({"t": s2.seconds, "mes": mes})
            elif obj.start3 > acum:
                mes = "<h1>Ultimele doua indicii se vor posta la ora 16:00</h1>"
                for i in range(3):
                    mes += indicii[i]
                return JsonResponse({"t": s3.seconds, "mes": mes})
            else:
                mes = ""
                for i in range(5):
                    mes += indicii[i]
                return JsonResponse({"t": -1, "mes": mes})

            
    return HttpResponseBadRequest()


#se apeleaza functia cand site-ul se incarca si transmite datele userului ca sa il putem urmari
def setCookieMeta(request):
    return JsonResponse({"status": 'ok'}) 
    # if request.method == 'POST':
        # user_agent = request.META['HTTP_USER_AGENT']
        # cookie = request.COOKIES.get('riverwolves_session') 
        # try:
        #     #exista obiectul in baza de date
        #     #luam obiectul din baza de date
        #     cookieObject = Cookie.objects.get(sid=cookie)
        #     try:
        #         #luam metadata care inca nu are datele introduse
        #         cm = cookieObject.metadate.get(dpi=-1)
        #         jsonb = json.loads(request.body)
        #         #verificam daca exista deja o metadata asemanatoare
        #         try:
        #             #deja exista o metadata cu acelasi user_agent si dpi
        #             deja = CookieMeta.objects.get(ip=cm.ip, user_agent=user_agent, dpi=jsonb['dpi'])

        #             #verificam si corectam datele din baza de date(userul poate sa fi avut o fereastra
        #             #redimensionata, deci marimea ecranului nu era cea corecta)
        #             if deja.width < jsonb['width']:
        #                 deja.width = jsonb['width']
        #             if deja.height < jsonb['height']:
        #                 deja.height = jsonb['height']

        #             deja.ora_data = timezone.now()
        #             deja.save()

        #             #stergem obiectul care este in plus
        #             cm.delete()
        #             if not deja in cookieObject.metadate.all():
        #                 cookieObject.metadate.add(deja)
                    
        #         except Exception as e:
        #             logging.info(e)
        #             #nu exista metadate asemanatoare, deci facem una
        #             cm.dpi = jsonb['dpi']
        #             cm.width = jsonb['width']
        #             cm.height = jsonb['height']
        #             cm.ora_data = timezone.now()
        #             cm.save()
    # return JsonResponse({"status": 'ok'}) 
    #         except:
    #             return JsonResponse({"status": 'errCM3'}) 
    #     except:
    #         return JsonResponse({"status": 'errCM2'}) 
    # else:
    #     return HttpResponseBadRequest()