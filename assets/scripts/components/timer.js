export default class Timer {
  constructor() {
    this.quizNavigation = document.querySelector('#quiz-navigation');
    this.timerCircle = document.getElementById('inner-circle');
    this.timeLeft = 59;
    this.timerInterval = null;
  }

  updateTimer() {
    const percent = (this.timeLeft / 59) * 100;
    const dashoffset = ((100 - percent) / 100) * 141.37;
    this.timerCircle.style.strokeDashoffset = dashoffset;
    if (this.timeLeft <= 0) {
      this.stopTimer();
      this.initQuizState();
    }
    this.timeLeft--;
  }

  initQuizState() {
    console.log('Time Over');
    window.location.href = '/index.html';
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }
}
