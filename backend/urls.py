from django.urls import path, include

from . import views

urlpatterns = [

    path('rw-api/sessionmeta/', views.setCookieMeta),
    path('rw-api/recrutari/', views.suntRecrutari),

    path('rw-api/register/', views.registerProtocol),
    path('rw-api/login/', views.loginProtocol),
    path('rw-api/jelyipv3/', views.jelyip),
    path('rw-api/setup/', views.setup),
    path('rw-api/getRoluri/', views.getRoluri),
    path('rw-api/getSponsori/', views.getSponsori),
    path('rw-api/rezerva/', views.rezerva),
    path('rw-api/th_login/', views.rezerva),
    path('rw-api/auth/', views.auth),
    path('rw-api/playbp3257SDGasfasf/', views.play_bp),
    path('rw-api/stopbp325235134566GFSAG/', views.stop_bp),
    path('rw-api/minekreft/get_skin/<str:nume>', views.get_skin),
    path('rw-api/omie/', views.obiecte),
]
