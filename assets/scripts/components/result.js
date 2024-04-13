export default class Result {
  constructor() {
    this.homeButton = document.querySelector('#home-button');
    this.userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    this.quizCard = document.querySelector('.quiz-card');
    this.qrcode = document.querySelector('.qrcode');
    this.imageSource = `../images/quiz-score/`;
    this.correctCount = 0;
  }

  calculateCorrectCount() {
    for (let userAnswer of this.userAnswers) {
      if (userAnswer === true) {
        this.correctCount += 1;
      }
    }
  }

  renderScore() {
    this.quizCard.src = `${this.imageSource}cards/card-${this.correctCount}.svg`;
    this.qrcode.src = `${this.imageSource}qrcode/qrcode-${this.correctCount}.svg`;
  }

  submitUserAnswers() {
    this.homeButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.postUserAnswers();
      window.location.href = '../../index.html';
    });
  }

  async postUserAnswers() {
    const storedAnswers = localStorage.getItem('userAnswers');
    const userAnswers = storedAnswers ? JSON.parse(storedAnswers) : [];

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAnswers }),
    };

    try {
      const response = await fetch(
        'https://3.37.238.149.nip.io/stats/incorrectRateUpdate',
        config
      );
      if (!response.ok) {
        throw new Error('네트워크 응답 에러');
      }
      return await response.json();
    } catch (error) {
      console.log(error);
      throw new Error('답안 전송 실패');
    }
  }

  run() {
    this.calculateCorrectCount();
    this.renderScore();
    this.submitUserAnswers();
  }
}
