from ..models import TreasureHuntSettings, Indiciu, IndiciuMeta, Task, TaskMeta
import logging
from django.utils import timezone as dtz
from .graf import getGraf
from .cachier import *
from .indicii import *


def getStartDT():
    setare = getSetare()
    if setare:
        return dtz.localtime(setare.ora_incepere)
    else: 
        return None

def getEndDT():
    setare = getSetare()
    if setare:
        return dtz.localtime(setare.ora_terminare)
    else: 
        return None

def getStart():
    setare = getSetare()
    if setare:
        return dtz.localtime(setare.ora_incepere).strftime("%m/%d/%Y, %H:%M:%S")
    else: 
        return None

def getEnd():
    setare = getSetare()
    if setare:
        return dtz.localtime(setare.ora_terminare).strftime("%m/%d/%Y, %H:%M:%S")
    else: 
        return None


def aInceput():
    return dtz.localtime(dtz.now()) > getStartDT()

def aTerminat():
    return dtz.localtime(dtz.now()) > getEndDT()