from django.urls import path
from . import views

app_name = 'stats'

urlpatterns = [
    path('correctRateUpdate', views.correctRateUpdate),
]