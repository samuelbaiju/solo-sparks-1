from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.db.models import Count

from .serializers import (
    QuestSerializer, UserSerializer, ReflectionSerializer, RewardSerializer, 
    UserProfileSerializer, PublicReflectionSerializer
)
from .models import Quest, Reflection, Reward, UserProfile, Tag

# Create your views here.

@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/register',
        '/api/quests',
        '/api/quests/<id>',
        '/api/reflections/',
        '/api/rewards/',
        '/api/rewards/<id>/redeem/',
        '/api/profile/',
        '/api/my-reflections/',
        '/api/public/reflection/<id>/',
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_reflection(request):
    serializer = ReflectionSerializer(data=request.data)
    if serializer.is_valid():
        # The quest is passed by its ID in the form data
        quest_id = request.data.get('quest')
        quest = Quest.objects.get(id=quest_id)

        reflection = serializer.save(user_profile=request.user.profile, quest=quest)
        
        # Award points to the user
        request.user.profile.spark_points += quest.points
        request.user.profile.save()
        
        # Use the PublicReflectionSerializer to return the full object with nested quest
        return Response(PublicReflectionSerializer(reflection).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quests(request):
    user_profile = request.user.profile

    # Get IDs of quests the user has already completed
    completed_quest_ids = Reflection.objects.filter(user_profile=user_profile).values_list('quest_id', flat=True)

    # Find the user's favorite tags based on completed quests
    favorite_tags = Tag.objects.filter(
        quest__in=completed_quest_ids
    ).annotate(
        tag_count=Count('name')
    ).order_by('-tag_count').values_list('id', flat=True)

    # Get all quests the user hasn't completed
    available_quests = Quest.objects.exclude(id__in=completed_quest_ids)

    # Prioritize available quests based on favorite tags
    # We use a Case/When to build a custom ordering
    from django.db.models import Case, When, Value, IntegerField

    if favorite_tags.exists():
        # Create a mapping of tag_id to its rank (lower is better)
        tag_ranking = {tag_id: rank for rank, tag_id in enumerate(favorite_tags)}
        
        # Build a list of When clauses for ordering
        priority_cases = [When(tags__id=tag_id, then=Value(rank)) for tag_id, rank in tag_ranking.items()]
        
        # Annotate quests with a priority score based on their tags
        # The lowest score is the best match
        # We also need to get distinct quests because a quest can have multiple tags
        recommended_quests = available_quests.filter(tags__in=favorite_tags).annotate(
            priority=Case(*priority_cases, default=Value(len(favorite_tags)), output_field=IntegerField())
        ).order_by('priority').distinct()

        # Get the IDs of the recommended quests
        recommended_quest_ids = recommended_quests.values_list('id', flat=True)
        
        # Get the remaining quests that don't have the user's favorite tags
        other_quests = available_quests.exclude(id__in=recommended_quest_ids)
        
        # Combine the lists
        # The recommendation is to show prioritized quests first
        final_quest_list = list(recommended_quests) + list(other_quests)
    else:
        # If the user has no favorite tags yet, just return all available quests
        final_quest_list = available_quests

    serializer = QuestSerializer(final_quest_list, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quest(request, pk):
    quest = Quest.objects.get(id=pk)
    serializer = QuestSerializer(quest, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    profile = user.profile
    serializer = UserProfileSerializer(profile, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rewards(request):
    rewards = Reward.objects.all()
    serializer = RewardSerializer(rewards, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def redeem_reward(request, pk):
    user = request.user
    try:
        reward = Reward.objects.get(id=pk)
    except Reward.DoesNotExist:
        return Response({'detail': 'Reward not found.'}, status=status.HTTP_404_NOT_FOUND)

    if user.profile.spark_points >= reward.cost:
        user.profile.spark_points -= reward.cost
        user.profile.save()
        # Here you could add logic to grant the reward to the user
        return Response({'detail': f'Reward "{reward.title}" redeemed successfully!'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Not enough spark points.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_reflections(request):
    reflections = Reflection.objects.filter(user_profile__user=request.user)
    serializer = PublicReflectionSerializer(reflections, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_public_reflection(request, pk):
    try:
        reflection = Reflection.objects.get(id=pk)
        serializer = PublicReflectionSerializer(reflection, many=False)
        return Response(serializer.data)
    except Reflection.DoesNotExist:
        return Response({'detail': 'Reflection not found.'}, status=status.HTTP_404_NOT_FOUND)
