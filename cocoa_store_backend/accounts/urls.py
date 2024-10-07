# store/urls.py

from django.urls import path
from accounts.views import UserProfileList, UserProfileDetail, UserDetailView, UserListCreateView, UserRetrieveUpdateDestroyView

urlpatterns = [
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('user-profiles/', UserProfileList.as_view(), name='user-profile-list'),
    path('user-profiles/<int:pk>/', UserProfileDetail.as_view(), name='user-profile-detail'),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
]
