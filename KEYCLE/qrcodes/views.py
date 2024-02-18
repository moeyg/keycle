from django.shortcuts import render

from django.http import HttpResponse,HttpResponseRedirect
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
from pathlib import Path
import qrcode, cv2
import json
from io import BytesIO
import numpy as np
import urllib.request
import boto3
import os

# Create your views here.
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
        img_path = current_path / 'kioskImg'/'score.png'
        images.save(img_path)
        #이미지 리턴해주기
        return HttpResponseRedirect(imagesUrl)