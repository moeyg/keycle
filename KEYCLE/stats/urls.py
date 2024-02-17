from django.urls import path
from . import views

app_name = 'Stat'

urlpatterns = [
    path('correctRateUpdate', views.correctRateUpdate),
]