from ..models import Observatie
from ..utils import get_client_ip
from django.http import JsonResponse 
from django.utils import timezone

def jelyip(request):
    try:
        jip = Observatie.objects.get(nume="jelyip")
        jip.text = get_client_ip(request)
        jip.ora_data = timezone.now()
        jip.save()
    except:
        Observatie(nume="jelyip", text=get_client_ip(request)).save()
    return JsonResponse({"raspuns": "oc"})