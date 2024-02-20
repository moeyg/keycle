export default class IncorrectRate {
  constructor() {
    this.commentaryURL = window.location.pathname;
    this.regex = /quiz-(\d+)/;
    this.index = parseInt(this.commentaryURL.match(this.regex)[1]) - 1;
    this.rateValue = document.querySelector('#rate-value');
  }

  setIncorrectRate() {
    const incorrectRate = JSON.parse(localStorage.getItem('incorrectRate'));
    const value = incorrectRate[this.index];
    this.rateValue.innerText = `${value}%`;
  }
}
