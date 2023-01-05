from django.core.cache import cache

COOKIE_KEY = "cookieuri"
GEOTRACK_KEY = "geotrack."

EXPIRA = 60 * 60 * 5 #5 ore

def getGeotrack(ip):
    from ..models import GeoTrack
    gt = cache.get(GEOTRACK_KEY+ip)
    if gt:
        return gt
    else:
        try:
            gtrk = GeoTrack.objects.get(ip=ip)
            cache.set(GEOTRACK_KEY+ip, gtrk, EXPIRA)
            return gtrk
        except:
            return None


def updateCookies():
    from ..models import Cookie
    cache.set(COOKIE_KEY, Cookie.objects.all(), EXPIRA)

def getCookies():
    from ..models import Cookie
    ck = cache.get(COOKIE_KEY)
    if ck:
        return ck
    else:
        try:
            c = Cookie.objects.all()
            cache.set(COOKIE_KEY, c, EXPIRA)
            return c
        except:
            return None