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

dotenv.load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("accesskey")
AWS_SECRET_ACCESS_KEY = os.getenv("secreatkey")
AWS_DEFAULT_REGION = os.getenv("region")

def uploadedImage(file):
    file_name = file.name
    img = Image.open(file)
    #현재 이미지 주소
    current_path = Path(__file__).parent
    img_path = current_path / 'keycleImg' / file_name
    img.save(img_path)

def s3SaveImage(img_path,file_name):
    s3 = boto3.client(
                service_name='s3',
                region_name=AWS_DEFAULT_REGION,
                aws_access_key_id = AWS_ACCESS_KEY_ID,
                aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
            )
    try:
        s3.upload_file(img_path,"keycle-image",file_name)
    except Exception as e : print(e)
    return s3

def imageCombine(file_name, frame):
    imageUrl = 'https://keycle-image.s3.ap-northeast-2.amazonaws.com/'+file_name
    frameUrl = 'https://keycle-image.s3.ap-northeast-2.amazonaws.com/'+frame+'.png'
    #사진 처리
    with urllib.request.urlopen(imageUrl) as url:
        s = url.read()
    # 데이터를 numpy 배열로 변환
    arr = np.asarray(bytearray(s), dtype=np.uint8)
    # numpy 배열을 이미지로 변환
    image1 = cv2.imdecode(arr, -1)
    #프레임 처리
    with urllib.request.urlopen(frameUrl) as url:
        s = url.read()
    arr = np.asarray(bytearray(s), dtype=np.uint8)
    image2 = cv2.imdecode(arr, -1)

    height, width, channels = image2.shape
    #프레임별 사이즈 처리
    if frame == 'frameDark':
        target_size = (400, 600)
        resize_image2 = cv2.resize(image2,target_size)
    elif frame == 'frameCream':
        target_size = (400,550)
        resize_image2 = cv2.resize(image2,target_size)
    # image1과 image2의 크기가 동일하다고 가정하고, 둘 다 RGBA 형태라고 가정
    image1_rgba = cv2.cvtColor(image1, cv2.COLOR_RGB2RGBA)
    image2_rgba = cv2.cvtColor(resize_image2, cv2.COLOR_RGB2RGBA)
    # image2의 alpha 채널을 가져옴
    alpha = image2_rgba[:, :, 3] / 255.0
    alpha = np.expand_dims(alpha, axis=2)
    # image1과 image2를 합침. image2의 alph 채널을 활용
    combined = (1.0 - alpha) * image1_rgba + alpha * image2_rgba
    combined = combined.astype(np.uint8)
    cv2.imwrite('image.png', combined) #현재 경로에 image라는 이름으로 저장장

def imageRemoveAndS3Save(file_name,s3,img_path):
    current_path = Path(__file__).parent
    try:
        s3.upload_file('image.png',"keycle-image",'qr_'+file_name) #qr을 붙인 파일이름으로 저장!
        s3.delete_object(Bucket='keycle-image', Key=file_name)
        if os.path.isfile(img_path):
            os.remove(img_path)
    except Exception as e : print(e)
    imageUrl = 'https://keycle-image.s3.ap-northeast-2.amazonaws.com/qr_'+file_name
    images = qrcode.make(imageUrl)
    img_path = current_path / 'keycleImg'/'qr.png'
    images.save(img_path)
    # 이미지 파일 경로
    img_path = current_path / 'keycleImg'/'qr.png'
    with open(img_path, 'rb') as f:
            image_data = f.read()
    return image_data