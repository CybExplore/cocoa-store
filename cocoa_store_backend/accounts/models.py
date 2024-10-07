from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
<<<<<<< HEAD
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    # You can add more fields as needed

    def __str__(self):
        return self.user.username
=======
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to User
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    # Add other profile fields as needed

    def __str__(self):
        return self.user.username  # or return a full name
>>>>>>> 4a3366c (Initial commit)

# Optional: You can create signals to automatically create or update user profiles
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
