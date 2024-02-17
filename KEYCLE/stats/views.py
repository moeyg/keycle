from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Stats
import json

# 오답률 업데이트 함수
@api_view(['POST'])
def incorrectRateUpdate(request):
    if request.method == 'POST':
        lastNumber = 7
        inputData = json.loads(request.body.decode('utf-8'))
        list = inputData.get('userAnswers', [])
        # 각 문제의 정답수 업데이트
        for questionId, isCorrect in enumerate(list):
            stat = Stats.objects.get(questionId = questionId + 1)
            stat.correctAnswer += isCorrect
            stat.save()
        # 전체 문제 수 업데이트
        stat = Stats.objects.get(questionId = lastNumber)
        stat.correctAnswer += 1
        stat.save()
        return JsonResponse({"message" : "success"}, status=200)
    return JsonResponse({"message" : "fail"}, status=403)