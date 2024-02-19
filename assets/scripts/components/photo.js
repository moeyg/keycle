export default class Photo {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.camera = document.querySelector('#camera');
    this.shutter = document.querySelector('#shutter');
    this.frameCream = document.querySelector('#frame-cream');
    this.frameDark = document.querySelector('#frame-dark');
    this.photoContainer = document.querySelector('.photo-container');
    this.qrcodeInfo = document.querySelector('#qrcode-info');
    this.countdownElement = document.querySelector('#countdown');
    this.frame = document.querySelector('#frame');
    this.frameURL = '../images/frame/';

    this.frameCream.addEventListener('click', this.setFrameCream.bind(this));
    this.frameDark.addEventListener('click', this.setFrameDark.bind(this));
    this.shutter.addEventListener('click', this.countdown.bind(this));
  }

  setFrameCream() {
    this.setFrame(
      'frame-cream.svg',
      'var(--yellow)',
      'var(--light-green)',
      'black',
      this.frameCream,
      this.frameDark
    );
  }

  setFrameDark() {
    this.setFrame(
      'frame-dark.svg',
      'var(--dark-gray)',
      'var(--light-green)',
      'white',
      this.frameDark,
      this.frameCream
    );
  }

  setFrame(
    frameSRC,
    backgroundColor,
    buttonBackgroundColor,
    qrcodeInfoColor,
    frame,
    otherFrame
  ) {
    this.photoContainer.style.background = backgroundColor;
    this.frame.src = `${this.frameURL}${frameSRC}`;
    frame.style.background = buttonBackgroundColor;
    otherFrame.style.background = '#D2D2D2';
    this.qrcodeInfo.style.color = qrcodeInfoColor;
  }

  countdown() {
    let count = 3;
    const countdownInterval = setInterval(() => {
      this.countdownElement.innerText = count;
      count--;
      if (count < 0) {
        clearInterval(countdownInterval);
        this.takePhoto();
        this.countdownElement.remove();
      }
    }, 1000);
  }

  takePhoto() {
    this.canvas.width = 400;
    this.canvas.height = 600;

    const sourceX = (this.camera.videoWidth - this.canvas.width) / 2;
    const sourceY = (this.camera.videoHeight - this.canvas.height) / 2;
    const context = this.canvas.getContext('2d');

    context.save();
    context.scale(-1, 1);
    context.translate(-this.canvas.width, 0);
    context.drawImage(
      this.camera,
      sourceX,
      sourceY,
      this.canvas.width,
      this.canvas.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    context.restore();

    const imageData = this.canvas.toDataURL('image/png', 1.0);
    const blobData = this.dataURItoBlob(imageData);
    const formData = new FormData();

    formData.append('file', blobData, this.generateRandomString());
    formData.append('frame', '1');

    fetch('API', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('이미지 업로드 실패');
        }
        return response.text();
      })
      .then((data) => {
        console.log('이미지 업로드 성공:', data);
        localStorage.setItem('QRcode', data);
      })
      .catch((error) => {
        console.error('이미지 업로드 에러:', error);
      });

    this.camera.pause();

    const frameOptions = document.querySelector('.frame-options');
    const photoQrcode = document.querySelector('#photo-qrcode');
    const homeButton = document.querySelector('#home');

    this.shutter.classList.add('ir');
    frameOptions.classList.add('ir');
    photoQrcode.classList.remove('ir');
    homeButton.classList.add('home-button-setting');
  }

  generateRandomString() {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const stringLength = 10;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      let randomIdex = Math.floor(Math.random() * charset.length);
      randomstring += charset.substring(randomIdex, randomIdex + 1);
    }
    return randomstring + '.png';
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
}
