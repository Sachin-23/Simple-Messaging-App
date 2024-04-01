# Websocket
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.auth import login

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

# username: websocket object
users = dict()

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        headers = dict(self.scope["headers"])
       
        print(headers)

        if b"token" not in headers.keys():
            self.send(text_data=json.dumps({"error": "Provide token."}))
            self.close()
            return
        token = headers[b"token"].decode('utf-8')

        try:
            user = Token.objects.get(key=token).user
        except Exception as e:
            self.send(text_data=json.dumps({"error": "User not found. Login again."}))
            self.close()
            return
        users[user.username] = self
        print("Connected by: ", user.username)
        self.send(text_data=json.dumps({"msg": "success"}))

    def disconnect(self, close_code):
        headers = dict(self.scope["headers"])
        if b"token" not in headers.keys():
            self.send(text_data=json.dumps({"error": "Provide token."}))
            self.close()
            return
        token = headers[b"token"].decode('utf-8')
        user = Token.objects.get(key=token).user
        if user.username in users.keys():
            rem = users.pop(user.username)
            print("Disconnected by: ", user.username, rem)
        else:
            print("DEBUG:")

    def receive(self, text_data=None):
        print(users)
        self.send(text_data={"msg":"TODO"})

    def sendMsg(self, sender, msg):
        'sender and msg cannot be empty'
        if sender and msg:
            self.send(text_data=json.dumps({"user": sender, "msg": msg}))
            return 1
        else:
            return None


