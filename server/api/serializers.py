from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password


class MyTokenpairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token


class RegisterSerializer(serializers.ModelSerializer):
    first_name=serializers.CharField(max_length=10)
    last_name=serializers.CharField(max_length=10)
    email= serializers.EmailField()
    password1 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    class Meta:
        model=User
        fields=["id","username","first_name","last_name","email","password1",'password2']
    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        if User.objects.filter(username=data['username']):
            raise serializers.ValidationError("username taken")

        return data    
    def create(self,validated_data):
        user=User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password1'])  # Hash the password
        user.save()
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
        model=Comment
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
    posts=serializers.IntegerField(default=0)
    likes=serializers.IntegerField(default=0)
    bookmarks=serializers.IntegerField(default=0)