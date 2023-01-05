#from backend.test import runTest
import haversine as hs
from haversine.haversine import Unit


def getDistanta(loc1):
    loc1u=(float(loc1.lat), float(loc1.lon))
    loc2u=(float(45.166470), float(28.798376))
    return hs.haversine(loc1u, loc2u, unit=Unit.METERS)

def runTest():
    from ..models import Indiciu
    i = 0
    for indiciu in Indiciu.objects.all():
        if indiciu.echipe != 0:
            print(indiciu)
            indiciu.echipe = 0
            indiciu.save()
            i+=1
            print(i)
    # resetIndicii() 45.177124, 28.803971


def resetIndicii():
    from ..models import Indiciu
    for indiciu in Indiciu.objects.all():
        if indiciu.echipe > 0 or indiciu.echipe < 0:
            indiciu.echipe = 0
            indiciu.save()