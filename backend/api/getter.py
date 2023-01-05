from django.http.response import HttpResponseBadRequest, JsonResponse
from backend.api.auth import auth_protocol
from ..models import Sponsor

def getSponsori(uReq):
    sponsori = []
    for sponsor in Sponsor.objects.all():
        sponsori.append({
            "nume": sponsor.nume,
            "url": sponsor.poza.url,
            "text": sponsor.text,
            "link": sponsor.link,
        })
    return JsonResponse({"raspuns": sponsori})

