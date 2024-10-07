from django.shortcuts import render
from accounts.models import UserProfile
from accounts.serializers import UserProfileSerializer
from rest_framework import generics

# Create your views here.


# User Profile Views
class UserProfileList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    
    
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.serializers import UserSerializer

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get(self, request):
        user = request.user  # Get the current logged-in user
        serializer = UserSerializer(user)
        return Response(serializer.data)  # Return serialized user data

# views.py
from rest_framework import generics, permissions
from .models import User  # Ensure you import your User model
from .serializers import UserSerializer

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  # Only staff users can access this

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  # Only staff users can access this
