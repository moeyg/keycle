export default class Quiz {
  constructor() {
    this.options = document.querySelectorAll('.answer-list');
    this.submitButton = document.querySelector('.choice-submit-button');
    this.quizURL = window.location.pathname;
    this.regex = /quiz-(\d+)/;
    this.index = parseInt(this.quizURL.match(this.regex)[1]) - 1;
    this.answerURL = this.quizURL.replace(
      `quiz/quiz-${this.index + 1}`,
      `answer/answer-${this.index + 1}`
    );
    this.selectedOption;

    const storedAnswers = localStorage.getItem('userAnswers');
    this.userAnswers = storedAnswers ? JSON.parse(storedAnswers) : [];

    this.init();
  }

  init() {
    this.addOptionListeners();
    this.submitButtonListener();
  }

  addOptionListeners() {
    this.options.forEach((choice) => {
      choice.addEventListener('click', () => {
        this.submitButton.style.backgroundColor = 'var(--light-green)';
        this.handleOptionSelection(choice);
      });
    });
  }

  handleOptionSelection(choice) {
    choice.classList.add('correct-answer');

    this.options.forEach((otherOptions) => {
      if (otherOptions !== choice) {
        otherOptions.classList.remove('correct-answer');
      }
    });

    if (choice.classList.contains('right')) {
      this.userAnswers[this.index] = true;
    } else {
      this.userAnswers[this.index] = false;
    }

    this.selectedOption = choice.querySelector('.answer-letter').innerText;
    this.submitButton.removeAttribute('disabled');
  }

  submitButtonListener() {
    this.submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.saveUserAnswers();
      window.location = this.answerURL;
    });
  }

  saveUserAnswers() {
    localStorage.setItem('selectedOption', this.selectedOption);
    localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
  }
}
