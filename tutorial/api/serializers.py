from rest_framework import serializers
from api.models import User, Chats, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "bio", "profile_pic"]

    def create(self, validated_data):
        print("From Serializer: ", validated_data)
        profile_pic = ""
        bio = ""

        if "profile_pic" in validated_data.keys():
            profile_pic = validated_data['profile_pic'] 

        if "bio" in validated_data.keys():
            bio = validated_data["bio"] 

        user = User.objects.create(
                username=validated_data['username'],
                bio=bio,
                profile_pic=profile_pic)

        user.set_password(validated_data['password'])
        user.save()

        print("Done from serializer")

        return user


class ChatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chats
        fields = "__all__"

class MsgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


