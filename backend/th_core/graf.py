from .cachier import getIndicii
import haversine as hs
from haversine.haversine import Unit
import logging
import random
import pickle


harta = None

def getGraf():
    global harta
    if not harta:
        try:
            a_file = open("graf.pkl", "rb")
            harta = pickle.load(a_file)
        except:
            harta = {}
            indicii = getIndicii()
            vizitate = []
            for indiciu in indicii:
                vizitate.append(indiciu)
                vecini = getVecini(indiciu, indicii, vizitate)
                harta[str(indiciu.pk)] = vecini
            a_file = open("graf.pkl", "wb")
            pickle.dump(harta, a_file)
            a_file.close()
    return harta


MARJA = 400 #metri

def getVecini(indiciu, indicii, vizitate):
    rez = {}
    app_m = 1000000
    app = None
    for pvecin in indicii:
        if not pvecin is vizitate[len(vizitate)-1]:
            loc1=(float(indiciu.locatie.lat), float(indiciu.locatie.lon))
            loc2=(float(pvecin.locatie.lat), float(pvecin.locatie.lon))
            rz = hs.haversine(loc1, loc2, unit=Unit.METERS)
            if rz < app_m:
                app_m = rz
                app = pvecin
            if 400 > rz:
                if rz < 1: rz = 1
                rez[str(pvecin.pk)] = rz
    if app and not bool(rez):
        rez[str(app.pk)] = app_m

    return rez