import os, sys
from PIL import Image, ImageDraw, ImageFont
from django.http.response import HttpResponse
import requests
from io import BytesIO
from ..models import Melodie, Observatie
from ..utils import get_client_ip
from django.http import JsonResponse 
from django.utils import timezone
import json
import logging
import base64
from ..utils import skin_renderer, trimite_comanda_rwc
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def play_bp(request):
    aleasa = None
    for mel in Melodie.objects.all:
        if mel.curenta:
            aleasa = mel
            break
    trimite_comanda_rwc("play", [aleasa])
    return HttpResponse()

@csrf_exempt
def stop_bp(request):
    trimite_comanda_rwc("stop", [])
    return HttpResponse()


def get_skin(request, nume):
    # skin_uuid = requests.get("https://api.mojang.com/users/profiles/minecraft/"+nume).text
    # skin_uuid = json.loads(skin_uuid)
    # infos = requests.get("https://sessionserver.mojang.com/session/minecraft/profile/"+skin_uuid["id"]).text
    # infos = json.loads(infos)["properties"][0]["value"]
    # infos = base64.b64decode(infos).decode('utf-8')
    # infos = json.loads(infos)
    # return JsonResponse(infos)
    # response = requests.get("https://minotar.net/body/"+nume+"/100.png")
    try:
        skin = skin_renderer.getSkin(nume)
    except:
        skin = skin_renderer.getSkin("Steve")
    printable = Image.open("/home/pi/pidjango/backend/api/bg_Skin.png")
    Sw, Sh = skin.size
    Pw, Ph = printable.size
    printable.paste(skin, (int(Pw/2)-int(Sw/2),int(Ph/2)-int(Sh/2)), skin)
    img_io = BytesIO()
    printable.save(img_io, 'PNG', quality=100)
    img_io.seek(0)
    image_data = img_io.getvalue()
    return HttpResponse(image_data, content_type="image/png")