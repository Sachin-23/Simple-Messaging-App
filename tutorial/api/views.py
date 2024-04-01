from rest_framework import generics
from rest_framework.response import Response
from api.models import User, Chats, Message
from api.serializers import UserSerializer, ChatsSerializer, MsgSerializer
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication 
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import filters
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.views import ObtainAuthToken

from django.db.models import Q

import time

from api.consumer import users

class LoginUserView(ObtainAuthToken):
    throttle_classes = ()
    permission_classes = ()
    #parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,) 
    #renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        res = super().post(request, *args, **kwargs)
        token = res.data["token"]
        username=request.data["username"]
        password=request.data["password"]
        user = authenticate(username=username, password=password)
        return Response({"username": user.username, "token": token, "bio": user.bio})

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer 
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        username = request.data["username"]
        password = request.data["password"]
        # Authenticate ?
        user = authenticate(username=username, password=password)
        token = Token.objects.create(user=user)
        return Response({"username": username, "token": token.key, "bio": user.bio})

class SearchUserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["^username"]
    authentication_classes = [TokenAuthentication]


class ChatsView(generics.ListAPIView):
    serializer_class = ChatsSerializer 
    permission_classes = [AllowAny]
    ordering = ['time']

    def get_queryset(self):
        user = self.request.user
        print(user)
        chats = Chats.objects.filter(Q(receiver=user) | Q(sender=user))
        print(chats)
        return chats

    def list(self, request):
        queryset = self.get_queryset()
        serializer = ChatsSerializer(queryset, many=True)
        print(serializer.data)
        chats = dict()
        # Fix this -- come up with a better solution
        for i in serializer.data:
            key = tuple({i["receiver"], i["sender"]})
            if i["receiver"] == self.request.user.username:
                i["receiver"] = i["sender"]
            chats[key] = i
        data = [chats[x] for x in chats]
        return Response(data)


class ChatView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MsgSerializer 
    filter_backends = [filters.SearchFilter]
    search_fields = ["=receiver__username"]
    authentication_classes = [TokenAuthentication]
    ordering = ['-time']

    def create(self, request, *args, **kwargs):
        '''
        Use web socket in client and backend save it all the sockets in a dictionary {user: socket}
        and if new message arrives then asynchronously check if the users exist in the dict send the message

        Initialize the web socket send the pending message to the user, then add it to the dictionary 
        '''
        sender = request.user
        receiver = User.objects.get(username=request.data["receiver"])
        content = request.data["content"]
        msg = Message(sender=sender, receiver=receiver, content=content)
        msg.save()

        print(users)

        if receiver.username in users.keys():
            print(users[receiver.username].sendMsg(sender=sender.username, msg="reload"))

        rmsg, created = Chats.objects.update_or_create(sender=sender, receiver=receiver, defaults={"recentMsg": msg})
        if created:
            print("Chats created.")
        else:
            print("Updated.")
        return Response({"msg": "success"})

    def get_queryset(self):
        sender = self.request.user
        receiver = User.objects.get(username=self.request.query_params["receiver"])
        return Message.objects.filter((Q(sender=sender) | Q(receiver=sender)) & (Q(sender=receiver) | Q(receiver=receiver)))
        #return Message.objects.filter(Q(sender=sender) | Q(receiver=sender))


