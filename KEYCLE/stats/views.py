from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Stats
import json

# 오답률 업데이트 함수
@api_view(['POST', 'PATCH'])
def incorrectRateUpdate(request):
    if request.method == 'POST' or request.method == 'PATCH':
        lastNumber = Stats.objects.all().count()
        inputData = json.loads(request.body.decode('utf-8'))
        list = inputData.get('userAnswers', [])
        # 각 문제의 정답수 업데이트
        for question_id, is_correct in enumerate(list):
            stat = Stats.objects.get(question_id = question_id + 1)
            stat.correct_answer += is_correct
            stat.save()
        # 전체 문제 수 업데이트
        stat = Stats.objects.get(question_id = lastNumber)
        stat.correct_answer += 1
        stat.save()
        return JsonResponse({"message" : "success"}, status=200)
    return JsonResponse({"message" : "fail"}, status=403)

# 오답률 조회 함수
@api_view(['GET'])
def incorrectRate(request):
    if request.method == 'GET':
        # 전체 문제 수 조회
        lastNumber = Stats.objects.all().count()
        # 전체 응시자 수 조회
        dominator = Stats.objects.get(question_id=lastNumber).correct_answer
        incorrectRate = []
        incorrectRate.append(dominator)
        for questionId in range(1, lastNumber):
            # 각 문제의 오답률 계산
            stat = Stats.objects.get(question_id = questionId)
            if (dominator == 0):
                # 응시자가 없을 경우 0으로 처리
                incorrectRate.append(0)
                continue
            incorrectRate.append(round(100 - ((stat.correct_answer / dominator) * 100)))
        return JsonResponse({"incorrectRate" : incorrectRate}, status=200)
    return JsonResponse({"message" : "fail"}, status=403)