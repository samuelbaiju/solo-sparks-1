from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quest, UserProfile, Reflection, Reward, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class QuestSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Quest
        fields = ['id', 'title', 'description', 'quest_type', 'points', 'tags', 'created_at', 'updated_at']

class ReflectionSerializer(serializers.ModelSerializer):
    user_profile = serializers.ReadOnlyField(source='user_profile.user.username')

    class Meta:
        model = Reflection
        fields = ['id', 'user_profile', 'quest', 'text_reflection', 'photo', 'audio', 'created_at']
        read_only_fields = ['user_profile']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('mood', 'personality_traits', 'emotional_needs', 'spark_points')

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)
        UserProfile.objects.create(user=user, **profile_data)
        return user

class PublicReflectionSerializer(serializers.ModelSerializer):
    quest = QuestSerializer(read_only=True)
    user = UserSerializer(source='user_profile.user', read_only=True)

    class Meta:
        model = Reflection
        fields = ['id', 'user', 'quest', 'text_reflection', 'photo', 'audio', 'created_at']

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__' 