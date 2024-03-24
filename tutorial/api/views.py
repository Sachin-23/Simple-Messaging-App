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
        print(dir(user))
        token = Token.objects.create(user=user)
        return Response({"username": username, "token": token.key})

class SearchUserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["^username"]
    authentication_classes = [TokenAuthentication]


class ChatsView(generics.ListAPIView):
    queryset = Chats.objects.all()
    serializer_class = ChatsSerializer 
    filter_backends = [filters.SearchFilter]
    search_fields = ["=msgSender", "=msgReceiver"]
    permission_classes = [AllowAny]


class ChatView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MsgSerializer 
    filter_backends = [filters.SearchFilter]
    search_fields = ["=msgSender", "=msgReceiver"]
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        '''
        Use web socket in client and backend save it all the sockets in a dictionary {user: socket}
        and if new message arrives then asynchronously check if the users exist in the dict send the message

        Initialize the web socket send the pending message to the user, then add it to the dictionary 

        '''
        super().create(request, *args, **kwargs)
        return Response({"token": ""})

