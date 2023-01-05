import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from .comenzi import executa, executa_th
from .utils import trimite_comanda_th, trimite_comanda_rwc
from .models import User
from .th_core import getEchipa
import uuid

from asgiref.sync import sync_to_async

@sync_to_async
def executaComanda(rn, comanda, arg):
    try:
        u = User.objects.get(chat_room=rn)
        executa(comanda, u, arg, web=True)
        # logging.info(comanda+" executata")
    except Exception as e:
        logging.info(e)

@sync_to_async
def setOnline(rn, val):
    u = User.objects.get(chat_room=rn)
    u.online = val
    executa("online", u, [val])
    u.save()
    if val:
        executa("membri", u, None)
        executa("send_indicii", u, None)
        executa("send_rezervare", u, None)
        from .th_core import getStatii
        for statie in getStatii():
            for user in statie.useri.all():
                if str(user.sid) == str(u.sid):
                    # logging.info(str(user.sid)+" "+str(u.sid))
                    executa("send_statie", user, [statie])

class RWConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'rwapi_%s' % self.room_name

        # Intra in camera/conecteaza
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await setOnline(self.room_name, True)

        await self.accept()

    async def disconnect(self, close_code):
        await setOnline(self.room_name, False)

        # Paraseste camera/deconecteaza
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Primeste mesajul de la ws
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        comanda = text_data_json['comanda']
        argumente = text_data_json['argumente']
        await executaComanda(self.room_name, comanda, argumente)

        # Trimite mesajul la grup
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'comanda',
        #         'comanda': comanda,
        #         'argumente': argumente
        #     }
        # )

    # Primeste mesajul de la grup
    async def comanda(self, event):
        comanda = event['comanda']
        argumente = event['argumente']
        # logging.info(comanda +" executata!")
        # Trimite mesajul la websocket
        await self.send(text_data=json.dumps({
            'comanda': comanda,
            'argumente': argumente
        }))




















@sync_to_async
def offline(rn):
    try:
        e = getEchipa(rn)
        e.online = False
        e.save()
    except Exception as e:
        pass

@sync_to_async
def executaComandaTH(rn, comanda, arg):
    try:
        e = getEchipa(rn)
        if not e.online:
            e.online = True
            e.save()
        executa_th(comanda, e, arg, web=False)
        # logging.info(comanda+" executata")
    except Exception as e:
        trimite_comanda_th(str(rn), "eroare", ["Codul nu este valid"])

@sync_to_async
def executaComandaWebTH(rn, comanda, arg):
    try:
        e = getEchipa(rn)
        executa_th(comanda, e, arg, web=True)
        # logging.info(comanda+" executata")
    except Exception as e:
        trimite_comanda_th(str(rn), "eroare", ["Codul nu este valid"])

class THConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'rwapith_%s' % self.room_name

        # Intra in camera/conecteaza
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await executaComandaTH(self.room_name, "welcome", [])

        await self.accept()

    async def disconnect(self, close_code):
        await offline(self.room_name)

        # Paraseste camera/deconecteaza
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Primeste mesajul de la ws
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        comanda = text_data_json['comanda']
        argumente = text_data_json['argumente']
        await executaComandaWebTH(self.room_name, comanda, argumente)

    # Primeste mesajul de la grup
    async def comanda(self, event):
        comanda = event['comanda']
        argumente = event['argumente']
        logging.info(comanda +" executata!")
        # Trimite mesajul la websocket
        await self.send(text_data=json.dumps({
            'comanda': comanda,
            'argumente': argumente
        }))










@sync_to_async
def trimite_comanda(comanda, arg):
    try:
        trimite_comanda_rwc(comanda, arg)
    except Exception as e:
        logging.info(e)
class RWChampionshipConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'rwapirwc_%s' % self.room_name

        # Intra in camera/conecteaza
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Paraseste camera/deconecteaza
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Primeste mesajul de la ws
    async def receive(self, text_data):
        pass

    # Primeste mesajul de la grup
    async def comanda(self, event):
        comanda = event['comanda']
        argumente = event['argumente']
        # Trimite mesajul la websocket
        await self.send(text_data=json.dumps({
            'comanda': comanda,
            'argumente': argumente
        }))

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = 'rvw_chat_%s' % self.room_name

#         # Join room group
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         # Leave room group
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     # Receive message from WebSocket
#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         # Send message to room group
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message
#             }
#         )

#     # Receive message from room group
#     async def chat_message(self, event):
#         message = event['message']

#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))