from typing import Set
from django.contrib import admin
from .models import *

class IPAdmin(admin.ModelAdmin):
    list_display = ('ip', 'ora_data')

class LocatieAdmin(admin.ModelAdmin):
    list_display = ('lat', 'lon', 'acc', 'ora_data')

class UserAdmin(admin.ModelAdmin):
    list_display = ('nume', 'email', 'telefon')

class PersoanaAdmin(admin.ModelAdmin):
    list_display = ('nume', 'prenume', 'telefon', 'status')

class InformatiiAdmin(admin.ModelAdmin):
    list_display = ('target', 'acuratete', 'informatii', 'valid')

class ObservatieAdmin(admin.ModelAdmin):
    list_display = ('nume', 'text')

class SupraveghetorAdmin(admin.ModelAdmin):
    list_display = ('nume', 'ora_data')

class RolAdmin(admin.ModelAdmin):
    list_display = ('nume', 'nume_display')


admin.site.register(User, UserAdmin)
admin.site.register(IP, IPAdmin)
admin.site.register(Locatie, LocatieAdmin)
# admin.site.register(CookieMeta)
# admin.site.register(Cookie)
admin.site.register(Persoana, PersoanaAdmin)
admin.site.register(Informatie, InformatiiAdmin)
admin.site.register(Observatie, ObservatieAdmin)
admin.site.register(Supraveghetor, SupraveghetorAdmin)
admin.site.register(Rol, RolAdmin)
admin.site.register(Setari)
admin.site.register(GeoTrack)
admin.site.register(GrupTH)
admin.site.register(Indiciu)
admin.site.register(IndiciuMeta)
admin.site.register(Statie)
admin.site.register(Sedinta)
admin.site.register(Sponsor)
admin.site.register(Rezervare)
admin.site.register(Task)
admin.site.register(TaskMeta)
admin.site.register(TreasureHuntSettings)

admin.site.register(Membruv2)
admin.site.register(Puncte)
admin.site.register(Intalnire)

admin.site.register(Melodie)
admin.site.register(Obiecte)