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
      if (userAnswer === true || userAnswer === null) {
        this.correctCount += 1;
      }
    }
  }

  renderScore() {
    if (this.correctCount) {
      this.quizCard.src = `${this.imageSource}cards/card-${this.correctCount}.svg`;
      this.qrcode.src = `${this.imageSource}qrcode/qrcode-${this.correctCount}.svg`;
    }
  }

  submitUserAnswers() {
    this.homeButton.addEventListener('click', (event) => {
      event.preventDefault();

      const storedAnswers = localStorage.getItem('userAnswers');
      const userAnswers = storedAnswers ? JSON.parse(storedAnswers) : [];

      fetch('http://3.37.238.149/stats/incorrectRateUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAnswers }),
      })
        .then((response) => {
          console.log(response);

          if (!response.ok) {
            throw new Error('사용자 답안 전송 실패');
          }
          return response.json();
        })
        .then((data) => {
          console.log('사용자 답안 전송 성공:', data);
        })
        .catch((error) => {
          console.error('사용자 답안 전송 에러:', error);
        });

      window.location.href = '../../index.html';
    });
  }

  run() {
    this.calculateCorrectCount();
    this.renderScore();
    this.submitUserAnswers();
  }
}
