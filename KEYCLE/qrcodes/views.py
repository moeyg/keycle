from django.shortcuts import render

from django.http import HttpResponse,HttpResponseRedirect
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
from pathlib import Path
import dotenv
import qrcode, cv2
import json
from io import BytesIO
import numpy as np
import urllib.request
import boto3
import os

# dotenv_path = Path('./.env')
dotenv.load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("accesskey")
AWS_SECRET_ACCESS_KEY = os.getenv("secreatkey")
AWS_DEFAULT_REGION = os.getenv("region")

# Create your views here.
@csrf_exempt #forbidden csrf cookie not set이 뜬다
def generate_qrcode(request):
    if request.method == 'POST':
        if 'file' not in request.FILES: #파일받아오기!
            return HttpResponse('No file part')
        file = request.FILES['file']
        file_name = file.name
        print(file_name)
        frame = request.POST.get('frame')
        print(frame)
        #이미지 임시저장 테스트
        img = Image.open(file)
        #현재 이미지 주소
        current_path = Path(__file__).parent
        img_path = current_path / 'kioskImg' / file_name
        img.save(img_path)
        print(AWS_ACCESS_KEY_ID) 
        #s3클라이언트 생성
        s3 = boto3.client(
                service_name='s3',
                region_name=AWS_DEFAULT_REGION,
                aws_access_key_id = AWS_ACCESS_KEY_ID,
                aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
            )
        try: 
            s3.upload_file(img_path,"keycle-image",file_name)
        except Exception as e : print(e)
        imageUrl = 'https://keycle-image.s3.ap-northeast-2.amazonaws.com/'+file_name
        frameUrl = 'https://keycle-image.s3.ap-northeast-2.amazonaws.com/frame'+str(frame)+'.png'
        #이미지 합성하기 코드 *짜야함*

        # URL에서 이미지 데이터 불러오기
        with urllib.request.urlopen(imageUrl) as url:
            s = url.read()

        # 데이터를 numpy 배열로 변환
        arr = np.asarray(bytearray(s), dtype=np.uint8)

        # numpy 배열을 이미지로 변환
        image1 = cv2.imdecode(arr, -1)

        with urllib.request.urlopen(frameUrl) as url:
            s = url.read()
        arr = np.asarray(bytearray(s), dtype=np.uint8)
        image2 = cv2.imdecode(arr, -1)
        height, width, channels = image2.shape

        target_size = (400, 600)
        resize_image2 = cv2.resize(image2,target_size)
        # # image1과 image2의 크기가 동일하다고 가정하고, 둘 다 RGBA 형태라고 가정
        image1_rgba = cv2.cvtColor(image1, cv2.COLOR_RGB2RGBA)
        image2_rgba = cv2.cvtColor(resize_image2, cv2.COLOR_RGB2RGBA)
        # image2의 alpha 채널을 가져옴
        alpha = image2_rgba[:, :, 3] / 255.0
        alpha = np.expand_dims(alpha, axis=2)

        # image1과 image2를 합침. image2의 alph 채널을 활용
        combined = (1.0 - alpha) * image1_rgba + alpha * image2_rgba

        # 결과 이미지는 float32 형태이므로 uint8로 변환
        combined = combined.astype(np.uint8)
        
        # 합친 이미지 저장하기
        cv2.imwrite('image.png', combined) #현재 경로에 image라는 이름으로 저장장
        try: 
            s3.upload_file('image.png',"keycle-image",'qr_'+file_name) #qr을 붙인 파일이름으로 저장!
            s3.delete_object(Bucket='keycle-image', Key=file_name)
            if os.path.isfile(img_path):
                os.remove(img_path)
        except Exception as e : print(e)
        imageUrl = 'https://keycle-image.s3.ap-northeast-2.amazonaws.com/qr_'+file_name
        images = qrcode.make(imageUrl)
        img_path = current_path / 'kioskImg'/'qr.jpg'
        images.save(img_path)
        # 이미지 파일 경로
        img_path = current_path / 'kioskImg'/'qr.jpg'

        # 이미지 파일을 바이트 데이터로 읽기
        with open(img_path, 'rb') as f:
            image_data = f.read()

        # HttpResponse 객체에 이미지 데이터 담아서 리턴
        return HttpResponse(image_data, content_type="image/jpeg")
    
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