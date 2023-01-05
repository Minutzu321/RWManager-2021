from backend.utils.ip import ip_romania
import logging
from django.http import JsonResponse 
from ..models import User
from ..utils import get_client_ip
import uuid

def auth_protocol(request):
    user_cookie = request.COOKIES.get('riverwolves_user')
    if user_cookie:
        ip = get_client_ip(request)
        if not ip_romania(ip):
            return None
        try:
            rw_user = User.objects.get(logid=user_cookie)
            if rw_user.status == 1:
                # cookie = request.COOKIES.get('riverwolves_session') 
                # if cookie:
                #     try:
                #         ckie = rw_user.cookies.get(sid=cookie)
                #         if ckie:
                return rw_user
                    # except:
                    #     pass
        except:
            pass
    return None

def auth(request):
    user_cookie = request.COOKIES.get('riverwolves_user')
    if user_cookie:
        ip = get_client_ip(request)
        try:
            rw_user = User.objects.get(logid=user_cookie)
            if rw_user.status == 1:
                raspuns = JsonResponse({
                    "valid": True,
                    "pk": rw_user.pk,
                    "nume": rw_user.nume,
                    "perm": rw_user.rol.permisiune,
                    "cred": rw_user.incredere,
                    "ws": rw_user.chat_room,
                })
                # cookie = cookie_protocol(request, ip , raspuns)
                # try:
                #     ckie = rw_user.cookies.get(sid=cookie.sid)
                #     if ckie:
                return raspuns
                # except Exception as e:
                #     logging.info(e)
                #     pass
            else:
                return JsonResponse({"valid": False})
        except:
            pass
    return JsonResponse({"valid": False})
    