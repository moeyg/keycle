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
