# chat/routing.py
from django.urls import re_path
from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^rw-api/ws/(?P<room_name>[^/]+)/$', consumers.RWConsumer.as_asgi()),
    url(r'^rw-api/ws_th/(?P<room_name>[^/]+)/$', consumers.THConsumer.as_asgi()),
    url(r'^rw-api/ws_rwc/(?P<room_name>[^/]+)/$', consumers.RWChampionshipConsumer.as_asgi()),
]