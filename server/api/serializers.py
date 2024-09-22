from rest_framework import serializers
from rest_framework_simplejwt.tokens import Token
from .models import *
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenpairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username']=user.username
        return token

class RegisterSerializer(serializers.ModelSerializer):
    first_name=serializers.CharField(max_length=10)
    last_name=serializers.CharField(max_length=10)
    class Meta:
        model=User
        fields=["id","username","first_name","last_name","email","password1",'password2']
    def create(self,validate_data):
        user=User.objects.create(**validate_data)
        return user          

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields="__all__"

class CategorySerializer(serializers.ModelSerializer):
    def get_post_counts(self,category):
       return category.post.count()
    class Meta:
        model=Category
        fields=['id','title','icons','slug','post_count']      


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        fields="__all__"
    def __init__(self,*args, **kwargs):
        super(PostSerializer,self).__init__(*args, **kwargs)
        request=self.context.get('request')
        if request and request.method == "POST": 
            self.Meta.depth=0
        else:
            self.Meta.depth=1    

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=comment
        fields="__all__"   
    def __init__(self,*args, **kwargs):
        super(CommentSerializer,self).__init__(*args, **kwargs)
        request=self.context.get('request')
        if request and request.method == "POST": 
            self.Meta.depth=0
        else:
            self.Meta.depth=1            

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model=Bookmark
        fields="__all__"   
    def __init__(self,*args, **kwargs):
        super(BookmarkSerializer,self).__init__(*args, **kwargs)
        request=self.context.get('request')
        if request and request.method == "POST": 
            self.Meta.depth=0
        else:
            self.Meta.depth=1           

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Notification
        fields="__all__"    
    def __init__(self,*args, **kwargs):
        super(NotificationSerializer,self).__init__(*args, **kwargs)
        request=self.context.get('request')
        if request and request.method == "POST": 
            self.Meta.depth=0
        else:
            self.Meta.depth=1          

class AuthorSerializer(serializers.Serializer):
    views=serializers.IntegerField(default=0)
    post=serializers.IntegerField(default=0)
    likes=serializers.IntegerField(default=0)
    bookmarks=serializers.IntegerField(default=0)