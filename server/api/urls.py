from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *
urlpatterns=[
    path('user/token/',MyTokenObtainView.as_view(),name="get_token"),
    path('user/register/',RegisterUserView.as_view(),name='register'),
    path('user/token/refresh/',TokenRefreshView.as_view(),name='refresh_token'),
    path('user/profile/<user_id>/',ProfileView.as_view()),
    #caterogy endpoints
    path('post/category/list/',CategoryListView.as_view(),name='categ_list'),
    path('post/category/post/<cat_slug>',PostCategoryAPIview.as_view(),name='categ_post_list'),
    #post endpoints
    path('post/list/',PostListAPIView.as_view(),name='post_list'),
    path('post/detail/<slug>/',PostDetailAPIView.as_view(),name="post_detail"),
    path('post/like_post/',LikePostAPIView.as_view(),name='likes'),
    path('post/comment/',PostCommentAPIView.as_view(),name="comment"),
    path('post/bookmark/',BookmarkPostAPIView.as_view(),name="bookmark"),
    
    #dashboard
    path('author/dashboard/stats/<user_id>/', DashboardStats.as_view()),
    path('author/dashboard/post-list/<user_id>/', DashboardPostLists.as_view()),
    path('author/dashboard/comment-list/', DashboardCommentLists.as_view()),
    path('author/dashboard/noti-list/<user_id>/', DashboardNotificationLists.as_view()),
    path('author/dashboard/noti-mark-seen/', DashboardNotificationSeen.as_view()),
    path('author/dashboard/reply-comment/',DashboardReplyComment.as_view()),
    path('author/dashboard/post-create/',DashboardCreatePostAPIView.as_view()),
    path('author/dashboard/post-detail/<user_id>/<post_id>/',DashboardEditPostAPIview.as_view()),
]