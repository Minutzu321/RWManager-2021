from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging

def trimite_comanda_rw(camera, comanda, argumente):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'rwapi_'+camera, {
            'type': 'comanda',
            'comanda': comanda,
            'argumente': argumente
            }
    )

def trimite_comanda_th(camera, comanda, argumente):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'rwapith_'+camera, {
            'type': 'comanda',
            'comanda': comanda,
            'argumente': argumente
            }
    )

def trimite_comanda_rwc(comanda, argumente):
    camera = "bp"
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'rwapirwc_'+camera, {
            'type': 'comanda',
            'comanda': comanda,
            'argumente': argumente
            }
    )