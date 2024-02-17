export default class Result {
  constructor() {
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
    if (this.correctCount) {
      this.quizCard.src = `${this.imageSource}cards/card-${this.correctCount}.svg`;
      this.qrcode.src = `${this.imageSource}qrcode/qrcode-${this.correctCount}.svg`;
    }
  }

  run() {
    this.calculateCorrectCount();
    this.renderScore();
  }
}
