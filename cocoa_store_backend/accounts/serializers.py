# serializers.py
from rest_framework import serializers
from accounts.models import UserProfile
from django.contrib.auth.models import User  # Ensure you import the correct User model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'is_staff', 'is_active']  # Add fields as necessary

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Embed the UserSerializer to include user details

    class Meta:
        model = UserProfile
        fields = '__all__'  # Or specify the fields you want to include, including 'user'

    def create(self, validated_data):
        user_data = validated_data.pop('user')  # Extract user data from validated data
        user = User.objects.create(**user_data)  # Create user instance
        user.set_password(user_data['password'])  # Hash the password
        user.save()
        
        user_profile = UserProfile.objects.create(user=user, **validated_data)  # Create user profile instance
        return user_profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)  # Extract user data if provided

        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)  # Update user fields
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)  # Update profile fields
        instance.save()

        return instance
