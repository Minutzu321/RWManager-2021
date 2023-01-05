import logging
from typing import DefaultDict
from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField
from django.utils import timezone
import uuid
from django.db.models import DEFERRED
from django.core.cache import cache
from django.dispatch import receiver
import os
import shutil


# class CacheModel(models.Model):
#     cid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

#     @classmethod
#     def from_db(cls, db, field_names, values):
#         # Default implementation of from_db() (subject to change and could
#         # be replaced with super()).
#         if len(values) != len(cls._meta.concrete_fields):
#             values = list(values)
#             values.reverse()
#             values = [
#                 values.pop() if f.attname in field_names else DEFERRED
#                 for f in cls._meta.concrete_fields
#             ]
#         for keyvalue in dict(zip(field_names, values)).items():
#             key, value = keyvalue[0], keyvalue[1]
#             logging.info(key)
#             logging.info(value)
#             logging.info(type(cls))
#         instance = cls(*values)
#         instance._state.adding = False
#         instance._state.db = db
#         # customization to store the original field values on the instance
#         instance._loaded_values = dict(zip(field_names, values))
#         return instance

#     class Meta:
#         abstract = True



class Setari(models.Model):
    prioritate = models.IntegerField(unique=True)
    cache = models.BooleanField(default=True)
    recrutari = models.BooleanField(default=False)

class Obiecte(models.Model):
    tabla = models.BooleanField(default=False)
    casa = models.BooleanField(default=False)
    piatra = models.BooleanField(default=False)
    moisil = models.BooleanField(default=False)
    carte = models.BooleanField(default=False)
    start1 = models.DateTimeField(default=timezone.now)
    start2 = models.DateTimeField(default=timezone.now)
    start3 = models.DateTimeField(default=timezone.now)

class Rol(models.Model):
    nume = models.CharField(max_length=50)
    nume_display = models.CharField(max_length=50)
    permisiune = models.SmallIntegerField(default=0)
    id_aplica = models.SmallIntegerField(default=-1)

    def __str__(self):
        return self.nume

class Persoana(models.Model):
    nume = models.CharField(max_length=50)
    prenume = models.CharField(max_length=100)
    telefon = models.CharField(max_length=10, unique=True)
    status = models.IntegerField(default=0)

    def __str__(self):
        return self.nume +" "+self.prenume

class Informatie(models.Model):
    valid = models.BooleanField(default=True)
    target = models.CharField(max_length=100)
    acuratete = models.SmallIntegerField()
    informatii = models.TextField()
    ora_data = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.target +" "+self.informatii

class Observatie(models.Model):
    nume = models.CharField(max_length=50)
    text = models.TextField()
    ora_data = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.nume

class Supraveghetor(models.Model):
    nume = models.CharField(max_length=50)
    ora_data = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.nume

class Locatie(models.Model):
    lat = models.CharField(max_length=100)
    lon = models.CharField(max_length=100)
    acc = models.FloatField(default=10000)
    viteza = models.FloatField(default=-1)
    directie = models.FloatField(default=-1)
    ora_data = models.DateTimeField(default=timezone.now)

    # def save(self, *args, **kwargs):
    #     logging.info("Ceva cu locatia")
    #     super(Locatie, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.lat) +", "+str(self.lon)+", "+str(self.acc)

class IP(models.Model):
    ip = models.GenericIPAddressField()
    ora_data = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.ip

# class CookieMeta(models.Model):
#     ip = models.GenericIPAddressField()
#     user_agent = models.CharField(max_length=400)

#     width = models.SmallIntegerField(default=-1)
#     height = models.SmallIntegerField(default=-1)
#     dpi = models.SmallIntegerField(default=-1)

#     ora_data = models.DateTimeField(default=timezone.now)

#     def __str__(self):
#         return str(self.ip)

# class Cookie(models.Model):
#     sid = models.UUIDField(default=uuid.uuid4, unique=True)
#     metadate = models.ManyToManyField(CookieMeta, blank=True)
#     ora_data = models.DateTimeField(default=timezone.now)
#     def __str__(self):
#         return str(self.c_sid)

class GeoTrack(models.Model):
    ip = models.GenericIPAddressField()
    tara = models.CharField(max_length=10)
    oras = models.CharField(max_length=80)
    regiune = models.CharField(max_length=80)
    loc = models.CharField(max_length=80)

    def __str__(self):
        return str(self.tara+", "+self.oras+", "+self.regiune)

class Puncte(models.Model):
    puncte = models.IntegerField(default=0)
    desc = models.TextField()

    def __str__(self):
        return self.desc

class Membruv2(models.Model):
    sid = models.UUIDField(default=uuid.uuid4, unique=True)
    nume = models.CharField(max_length=150)
    clasa = models.CharField(max_length=10, default="", blank=True)
    email = models.EmailField()
    telefon = models.CharField(max_length=10, unique=True)
    data_nastere = models.DateTimeField(default=timezone.now)
    rol = models.ForeignKey(Rol, on_delete=models.DO_NOTHING)
    puncte = models.ManyToManyField(Puncte, blank=True)

    def __str__(self):
        return self.nume


class User(models.Model):
    sid = models.UUIDField(default=uuid.uuid4, unique=True)
    logid = models.UUIDField(default=uuid.uuid4, unique=True)
    chat_room = models.UUIDField(default=uuid.uuid4, unique=True)

    data_inregistrare = models.DateTimeField(default=timezone.now)

    online = models.BooleanField(default=False)

    nume = models.CharField(max_length=150)
    nick = models.CharField(max_length=100, default="", blank=True)
    email = models.EmailField()
    telefon = models.CharField(max_length=10, unique=True)
    data_nastere = models.DateTimeField(default=timezone.now)
    rol = models.ForeignKey(Rol, on_delete=models.DO_NOTHING)
    rookie = models.BooleanField(default=True)
    activitate = models.SmallIntegerField(default=0)
    # cookies = models.ManyToManyField(Cookie, blank=True)
    ips = models.ManyToManyField(IP, blank=True)
    locatii = models.ManyToManyField(Locatie, blank=True)
    status = models.IntegerField(default=0)
    incredere = models.SmallIntegerField(default=0)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self._state.adding:
            # if(self.rol != self._loaded_values['rol']):
            #     executa("update_membru", self, None)
            # else:
            from .comenzi import executa
            executa("update_membru", self, None)
        

    def __str__(self):
        return self.nume

@receiver(models.signals.post_delete, sender=User)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    from .comenzi import executa
    executa("update_membru", None, None)

class Sedinta(models.Model):
    nume = models.CharField(max_length=400)
    desc = models.TextField()
    data_ora = models.DateTimeField(default=timezone.now)
    durata = models.SmallIntegerField(default=2)
    maxim_membri = models.SmallIntegerField(default=10)
    participanti = models.ManyToManyField(User, blank=True, related_name='participanti')
    prezenti = models.ManyToManyField(User, blank=True, related_name='prezenti')

    def __str__(self):
        return self.nume




class Intalnire(models.Model):
    nume = models.CharField(max_length=400)
    desc = models.TextField()
    data_ora = models.DateTimeField(default=timezone.now)
    durata = models.SmallIntegerField(default=2)
    participanti = models.ManyToManyField(Membruv2, blank=True, related_name='participantiv2')

    def __str__(self):
        return self.nume

class Melodie(models.Model):
    nume = models.CharField(max_length=400)
    data_ora = models.DateTimeField(default=timezone.now)
    fisier = models.FileField(upload_to='frontend/productie/media/melodii/')
    curenta = models.BooleanField(default=False);
    pozitie = models.SmallIntegerField(default=0)

    def __str__(self):
        return self.nume




















#TREASURE HUNT
class Indiciu(models.Model):
    # i_sid = models.UUIDField(default=uuid.uuid4, unique=True)
    text = models.TextField()
    rasp = models.CharField(max_length=300)
    locatie = models.ForeignKey(Locatie, on_delete=models.CASCADE)
    poza = models.ImageField(upload_to="incarcari/th/%Y%m%d%H%M%S%s")
    arataLocatie = models.BooleanField(default=False)
    arataPoza = models.BooleanField(default=False)
    dificultate = models.SmallIntegerField()
    echipe_simultan = models.SmallIntegerField(default=2)
    adugat_de = models.CharField(default="", max_length=300)
    status = models.SmallIntegerField(default=0)
    echipe = models.SmallIntegerField(default=0)
    extremitate = models.BooleanField(default=False)
    green = models.BooleanField(default=False)
    centru = models.BooleanField(default=False)

    def __str__(self):
        return self.text

    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)
    #     if not self._state.adding:
            # if(self.rol != self._loaded_values['rol']):
            #     executa("update_membru", self, None)
            # else:
            # from .comenzi import executa
            # executa("update_indiciu", None, None)

# @receiver(models.signals.post_save, sender=Indiciu)
# def auto_update_cachier(sender, instance, created, raw, using, update_fields, signal):
#     from .th_core import updateIndiciu
#     updateIndiciu(instance, created)

# @receiver(models.signals.post_delete, sender=Indiciu)
# def auto_delete_file_on_delete(sender, instance, **kwargs):
#     if instance.poza:
#         if os.path.isfile(instance.poza.path):
#             shutil.rmtree(os.path.dirname(instance.poza.path))
#     from .comenzi import executa
#     executa("update_indiciu", None, None)

# @receiver(models.signals.pre_save, sender=Indiciu)
# def auto_delete_file_on_change(sender, instance, **kwargs):
#     if not instance.pk:
#         return False
#     try:
#         old_file = Indiciu.objects.get(pk=instance.pk).poza
#     except Indiciu.DoesNotExist:
#         return False

#     new_file = instance.poza
#     if not old_file == new_file:
#         if os.path.isfile(old_file.path):
#             shutil.rmtree(os.path.dirname(instance.poza.path))


class IndiciuMeta(models.Model):
    indiciu = models.ForeignKey(Indiciu, on_delete=models.CASCADE)
    ora_data = models.DateTimeField(default=timezone.now)
    rezolvat = models.BooleanField(default=False)
    sarit = models.BooleanField(default=False)


class Sponsor(models.Model):
    nume = models.CharField(max_length=200)
    poza = models.ImageField(upload_to="incarcari/sponsori/%Y%m%d%H%M%S%s")
    text = models.TextField()
    link = models.TextField()

    def __str__(self):
        return self.nume

@receiver(models.signals.post_delete, sender=Sponsor)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.poza:
        if os.path.isfile(instance.poza.path):
            shutil.rmtree(os.path.dirname(instance.poza.path))

@receiver(models.signals.pre_save, sender=Sponsor)
def auto_delete_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_file = Sponsor.objects.get(pk=instance.pk).poza
    except Sponsor.DoesNotExist:
        return False

    new_file = instance.poza
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            shutil.rmtree(os.path.dirname(instance.poza.path))


class Task(models.Model):
    cerinta = models.TextField()
    poza = models.ImageField(upload_to="incarcari/taskuri/%Y%m%d%H%M%S%s", blank=True)
    ora = models.TimeField(default=timezone.now)
    timp_minute = models.SmallIntegerField(default=5)
    dificultate = models.SmallIntegerField(default=0)

    trimis = models.BooleanField(default=False)
    # incercari = models.ManyToManyField(CharField, blank=True)

    def __str__(self):
        return self.cerinta

class TaskMeta(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    ora_data = models.DateTimeField(default=timezone.now)
    poza = models.ImageField(upload_to="incarcari/taskuri_echipe/%Y%m%d%H%M%S%s", blank=True)
    rezolvat = models.BooleanField(default=False)
    trimis_la_analiza = models.BooleanField(default=False)
    analizat = models.BooleanField(default=False)
    # incercari = models.ManyToManyField(CharField, blank=True)


class Rezervare(models.Model):
    nume = models.CharField(max_length=300, default="")
    telefon = models.CharField(max_length=10, unique=True)
    persoane = models.SmallIntegerField()
    ip = models.GenericIPAddressField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        from .comenzi import executa
        executa("send_rezervari", None, None)



    def __str__(self):
        return self.nume


class GrupTH(models.Model):
    sid = models.UUIDField(default=uuid.uuid4, unique=True)
    nume = models.CharField(max_length=500, default="")
    telefon = models.CharField(max_length=10, unique=True)
    persoane = models.SmallIntegerField()
    dificultate = models.SmallIntegerField()
    greenGym = models.BooleanField(default=True)
    platite = models.SmallIntegerField(default=0)
    conditii = models.BooleanField(default=False)

    online = models.BooleanField(default=False)

    fostStatie =  models.BooleanField(default=False)
    inStatie =  models.BooleanField(default=False)
    lastStatie = models.DateTimeField(default=timezone.now)


    locatie = models.ForeignKey(Locatie, blank=True, on_delete=models.CASCADE, null=True)
    indicii = models.ManyToManyField(IndiciuMeta, blank=True)
    task = models.ForeignKey(TaskMeta, blank=True, on_delete=models.CASCADE, null=True)
    incercari = models.TextField(default="", blank=True)
    alerte = models.TextField(default="", blank=True)
    directie = models.SmallIntegerField(default=0)

    def __str__(self):
        return self.nume

# @receiver(models.signals.post_save, sender=GrupTH)
# def auto_update_cachier_echipa(sender, instance, created, raw, using, update_fields, signal):
#     from .th_core import updateEchipa
#     updateEchipa(instance, created)

# class Echipa(models.Model):
#     # e_sid
#     nume = models.CharField(max_length=500, default="")
#     telefon = models.CharField(max_length=10, unique=True)
#     persoane = models.SmallIntegerField()
#     dificultate = models.SmallIntegerField()
#     greenGym = models.BooleanField(default=True)
#     platite = models.SmallIntegerField(default=0)

#     baterie = models.SmallIntegerField(default=0)
#     locatii = models.ManyToManyField(Locatie, blank=True)
#     indicii = models.ManyToManyField(IndiciuMeta, blank=True)
#     taskuri = models.ManyToManyField(TaskMeta, blank=True)
#     incercari = models.TextField(default="", blank=True)

#     def __str__(self):
#         return self.nume

class TreasureHuntSettings(models.Model):
    ora_incepere = models.DateTimeField(default=timezone.now)
    ora_terminare = models.DateTimeField(default=timezone.now)

    inceput = models.BooleanField(default=False)
    terminat = models.BooleanField(default=False)

    mediu_1 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='mediu_1', blank=True, null=True)
    mediu_2 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='mediu_2', blank=True, null=True)
    mediu_3 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='mediu_3', blank=True, null=True)
    mediu_mentiune_1 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='mediu_mentiune_1', blank=True, null=True)
    mediu_mentiune_2 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='mediu_mentiune_2', blank=True, null=True)

    greu_1 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='greu_1', blank=True, null=True)
    greu_2 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='greu_2', blank=True, null=True)
    greu_3 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='greu_3', blank=True, null=True)
    greu_mentiune_1 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='greu_mentiune_1', blank=True, null=True)
    greu_mentiune_2 = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='greu_mentiune_2', blank=True, null=True)

    tombola = models.ForeignKey(GrupTH, on_delete=models.CASCADE, related_name='tombola', blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        from .th_core import resetSetare
        resetSetare()



class Statie(models.Model):
    st_sid = models.UUIDField(default=uuid.uuid4, unique=True)
    nume = models.CharField(max_length=400)
    locatie = models.ForeignKey(Locatie, on_delete=models.CASCADE, blank=True, null=True)
    useri = models.ManyToManyField(User, blank=True, related_name='useri')
    echipe = models.ManyToManyField(GrupTH, blank=True, related_name='echipe')
    au_fost = models.ManyToManyField(GrupTH, blank=True, related_name='au_fost')

    def __str__(self):
        return self.nume

# @receiver(models.signals.post_save, sender=Statie)
# def auto_update_cachier_statie(sender, instance, created, raw, using, update_fields, signal):
#     from .th_core import updateStatie
#     updateStatie(instance, created)

# @receiver(models.signals.m2m_changed, sender=Statie.echipe.through)
# def auto_update_cachier_statie_chgd(sender, instance, **kwargs):
#     for user in instance.useri.all():
#         from .comenzi import executa
#         executa("send_statie", user, [instance])
    # for echipa in instance.echipe.all():
    #     from .comenzi import executa_th
    #     echipa.inStatie = True
    #     echipa.save()
    #     executa_th("sendtts", echipa, [])
    
