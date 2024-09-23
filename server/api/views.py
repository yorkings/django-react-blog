from django.shortcuts import render
from .models import *
from .serializers import *
from django.db.models import Sum
#rest_framework
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import  generics,status
from rest_framework.decorators import APIView,api_view,permission_classes
from rest_framework.response import Response

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime

import json

#############APILISTS###############

class MyTokenObtainView(TokenObtainPairView):
    serializer_class=MyTokenpairSerializer

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes=[AllowAny]
    serializer_class=ProfileSerializer
    def get_object(self):
        user_id=self.kwargs['user_id']  
        user=User.objects.get(id=user_id)  
        profile=UserProfile.objects.get(user=user)
        return profile

class CategoryListView(generics.ListAPIView):
    serializer_class=CategorySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return Category.objects.all()
    
class PostCategoryAPIview(generics.ListAPIView):
    serializer_class=PostSerializer
    permission_classes=[AllowAny]
    def get_queryset(self):
        category_slug=self.kwargs['cat_slug']
        category=Category.objects.get(slug=category_slug)
        post=Post.objects.filter(category=category,status='Active')
        return post

class PostListAPIView(generics.ListAPIView):
    serializer_class=PostSerializer
    permission_classes=[AllowAny]
    def get_queryset(self):
        return Post.objects.filter(status='Active')
    
class PostDetailAPIView(generics.RetrieveAPIView):
    serializer_class=PostSerializer
    permission_classes=[AllowAny]
    def get_object(self):
        slug=self.kwargs['slug']
        post= Post.objects.get(slug=slug,status='Active')
        post.view+=1
        post.save()
        return post

class LikePostAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self,request):
        user_id=request.data['user_id']
        post_id=request.data['post_id']

        user=User.objects.get(id=user_id)
        post=Post.objects.get(id=post_id)

        if user in post.likes.all():
            post.likes.remove(user)
        else:
            post.likes.add(user) 
            Notification.objects.create(
                user=post.user,
                post=post,
                type='Like'
            )
            return Response({"message":"post liked"},status=status.HTTP_201_CREATED)   
        
class PostCommentAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'comment': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )    
    def post(self,request):
        post_id=request.data['post_id']
        name=request.data['name']
        email=request.data['email']
        comment=request.data['comment']

        post=Post.objects.get(id=post_id)
        Comment.objects.create(
            post=post,
            name=name,
            email=email,
            content=comment

        )
        Notification.objects.create(
            user=post.user,
            post=post,
            type='Comment'    
        )
        return Response({"message":"post comment sent"},status=status.HTTP_201_CREATED)   

class BookmarkPostAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self,request):
        post_id=request.data['post_id']
        user_id=request.data['user_id']
        
        user=User.objects.get(id=user_id)
        post=Post.objects.get(id=post_id)
        bookmarks=Bookmark.objects.filter(user=user,post=post).first()
        if bookmarks:
            bookmarks.delete()
            return Response({"message":"bookmark removed"},status=status.HTTP_200_OK)
        else:
            Bookmark.objects.create(user=user,post=post)  
            Notification.objects.create(user=user,post=post,type="Bookmark")  
            return Response({"message":"bookmark added"},status=status.HTTP_201_CREATED)
        

######################## Author Dashboard APIs ########################
class DashboardStats(generics.ListAPIView):
    serializer_class=AuthorSerializer
    permission_classes=[AllowAny]
    def get_queryset(self):
        user_id=self.kwargs["user_id"]
        user=User.objects.get(id=user_id)

        views=Post.objects.filter(user=user).aggregate(view = Sum('view'))['view']
        posts=Post.objects.filter(user=user).count()
        likes=Post.objects.filter(user=user).aggregate(total_likes=Sum('likes'))['total_likes']
        bookmarks=Bookmark.objects.filter(post__user=user).count()

        return [{
            'views':views,
            "posts":posts,
            "likes":likes,
            "bookmarks":bookmarks
        }]
    def list(self, request, *args, **kwargs):
        queryset=self.get_queryset()
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data)

class DashboardPostLists(generics.ListAPIView):
    serializer_class=PostSerializer
    permission_classes=[AllowAny]
    def get_queryset(self):
        user_id=self.kwargs['user_id']
        user=User.objects.get(id=user_id)
        return Post.objects.filter(user=user).order_by('id')   
    
class DashboardCommentLists(generics.ListAPIView):
    serializer_class=CommentSerializer
    permission_classes=[AllowAny]
    def get_queryset(self):
        user_id=self.kwargs['user_id']
        user=User.objects.get(id=user_id)
        
        return Comment.objects.filter(post__user=user)
    
class DashboardNotificationLists(generics.ListAPIView):
    serializer_class=NotificationSerializer
    permission_classes=[AllowAny]
    def get_queryset(self):
        user_id=self.kwargs['user_id']
        user=User.objects.get(id=user_id)
        return Notification.objects.get(user=user,seen=False)
    
class DashboardNotificationSeen(APIView):
    def post(self,request):
        noti_id=request.data["noti_id"]
        noti=Notification.objects.get(id=noti_id)
        noti.seen=True
        noti.save()
        return Response({'message':"marked as read"},status=status.HTTP_200_OK)    
    
class DashboardReplyComment(APIView):
    def post(self,request):
      comm_id=request.data["comm_id"]
      reply=request.data['reply']
      comm=Comment.objects.get(id=comm_id)
      comm.reply=reply
      comm.save()
      return Response({'message':"reply sucessful"},status=status.HTTP_200_OK) 
