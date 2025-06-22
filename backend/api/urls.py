from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_routes, name="routes"),
    path('register/', views.register_user, name="register"),
    path('quests/', views.get_quests, name="quests"),
    path('quests/<str:pk>/', views.get_quest, name="quest"),
    path('reflections/', views.create_reflection, name="create-reflection"),
    path('rewards/', views.get_rewards, name="rewards"),
    path('rewards/<str:pk>/redeem/', views.redeem_reward, name="redeem-reward"),
    path('profile/', views.get_user_profile, name="user-profile"),
    path('my-reflections/', views.get_my_reflections, name="my-reflections"),
    path('public/reflection/<str:pk>/', views.get_public_reflection, name="public-reflection"),
] 