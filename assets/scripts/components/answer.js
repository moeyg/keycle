export default class Answer {
  constructor() {
    this.question = document.querySelector('.question');
    this.correctOption = document.querySelector(
      '.right .answer-letter'
    ).innerText;
    this.selectedOption = localStorage.getItem('selectedOption');
    this.correctAnswer = document.querySelector(
      '.correct-answer .answer-comment'
    ).innerText;
    this.incorrectAnswer = document.querySelector(`.${this.selectedOption}`);
  }

  checkAnswer() {
    if (this.correctOption === this.selectedOption) {
      this.question.innerHTML = `정답! 정답은 <span id="right-value">${this.correctAnswer}</span>예요!`;
    } else {
      this.question.innerHTML = `땡! 정답은 <span id="right-value">${this.correctAnswer}</span>예요!`;
      this.incorrectAnswer.classList.add('incorrect-answer');
    }
  }
}
