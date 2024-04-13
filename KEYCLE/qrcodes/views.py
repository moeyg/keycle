from django.shortcuts import render
from .qrcodes import uploadedImage,s3SaveImage,imageCombine,imageRemoveAndS3Save

from django.http import HttpResponse,HttpResponseRedirect
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from PIL import Image #
from pathlib import Path
import dotenv
import qrcode, cv2
import json
from io import BytesIO
import numpy as np
import urllib.request
import boto3
import os

# Create your views here.
@csrf_exempt #forbidden csrf cookie not set이 뜬다
def generate_qrcode(request):
    if request.method == 'POST':
        if 'file' not in request.FILES: #파일받아오기!
            return HttpResponse('No file part')
        file = request.FILES['file']
        file_name = file.name
        frame = request.POST.get('frame')
        uploadedImage(file) #이미지 로컬 저장
        current_path = Path(__file__).parent
        img_path = current_path / 'keycleImg' / file_name
        #s3클라이언트 생성
        s3 = s3SaveImage(img_path,file_name)
        #이미지 합성하기
        imageCombine(file_name,frame)
        image_data = imageRemoveAndS3Save(file_name,s3,img_path)
        # HttpResponse 객체에 이미지 데이터 담아서 리턴
        response = HttpResponse(image_data, content_type="image/png")
        response["Access-Control-Allow-Origin"] = "*"
        return response

#점수 기준으로 큐알코드 날려주기 => 큐알저장해서 프론트에 저장후 사용함
@csrf_exempt 
def scoreQrcode(request):
    if request.method == 'POST':
        data = json.loads(request.body) # 응답을 json 형식으로 변환합니다.
        score = data.get("score") 
        print(score)
        current_path = Path(__file__).parent
        imagesUrl = 'https://keycle-image.s3.ap-northeast-2.amazonaws.com/score'+str(score)+'.png'
        images = qrcode.make(imagesUrl)
        img_path = current_path / 'keycleImg'/'score.png'
        images.save(img_path)
        #이미지 리턴해주기
        return HttpResponseRedirect(imagesUrl)