import ipinfo
import logging
from ..cachier import getGeotrack
from ..models import GeoTrack

def ip_romania(ip):
    gt = getGeotrack(ip)
    if gt:
        return gt.tara == "RO"
    else:
        hgt = hard_geotrack(ip)
        GeoTrack(ip=ip, tara=hgt.country, oras=hgt.city, regiune=hgt.region, loc=hgt.loc).save()
        return ip_romania(ip)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def hard_geotrack(ip_address):
	access_token = 'cc029ac23858d0'
	handler = ipinfo.getHandler(access_token)
	dets = handler.getDetails(ip_address)
	logging.info(dets.details)
	return dets