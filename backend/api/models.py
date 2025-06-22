from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Quest(models.Model):
    QUEST_TYPE_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    quest_type = models.CharField(max_length=10, choices=QUEST_TYPE_CHOICES)
    points = models.PositiveIntegerField()
    tags = models.ManyToManyField(Tag, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    mood = models.CharField(max_length=100, blank=True)
    personality_traits = models.TextField(blank=True)
    emotional_needs = models.TextField(blank=True)
    spark_points = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username

class Reflection(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='reflections')
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    text_reflection = models.TextField(blank=True, null=True)
    photo = CloudinaryField('image', blank=True, null=True)
    audio = CloudinaryField('video', resource_type='video', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Reflection for {self.quest.title} by {self.user_profile.user.username}'

class Reward(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    cost = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
