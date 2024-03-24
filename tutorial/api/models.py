from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(blank=True)

    def __str__(self):
        return f"Username: ${self.username}, password: ${self.password}"


class Message(models.Model):
    content = models.TextField(blank=True, max_length=256)
    image = models.ImageField(blank=True)
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="receiver")
    time = models.DateTimeField(auto_now_add=True)
    received = models.BooleanField(default=False)


class Chats(models.Model):
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="msgSender")
    receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="msgReceiver")
    recentMsg = models.ForeignKey(Message, on_delete=models.CASCADE, related_name="recentMsg")
    time = models.DateTimeField(auto_now_add=True)

