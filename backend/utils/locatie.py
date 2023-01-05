import random
import sys
import math
import haversine as hs
from haversine.haversine import Unit

def getDistanta(loc1, loc2):
    loc1u=(float(loc1.lat), float(loc1.lon))
    loc2u=(float(loc2.lat), float(loc2.lon))
    return hs.haversine(loc1u, loc2u, unit=Unit.METERS)

def punctRandom(lat, lng, radius=400):
    radiusInDegrees=radius/111300
    r = radiusInDegrees
    x0 = lat
    y0 = lng

    u = float(random.uniform(0.0,1.0))
    v = float(random.uniform(0.0,1.0))

    w = r * math.sqrt(u)
    t = 2 * math.pi * v
    x = w * math.cos(t) 
    y = w * math.sin(t)
    
    xLat  = x + x0
    yLong = y + y0

    return (xLat, yLong)