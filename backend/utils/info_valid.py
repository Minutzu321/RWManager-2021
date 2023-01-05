import logging
from datetime import datetime

def telefonValid(tel):
    if tel.isdigit() and len(tel) == 10:
        if tel.startswith('07'):
            return True
    return False

def emailValid(email):
    if '@' in email:
        if '.' in email and len(email) > 5:
            return True
    return False

def dataValida(dat):
    try:
        return datetime.strptime(dat, '%d/%m/%Y')
    except:
        return None
