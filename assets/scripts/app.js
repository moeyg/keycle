// Import
import Quiz from './components/quiz.js';
import Answer from './components/answer.js';
import Result from './components/result.js';

document.addEventListener('DOMContentLoaded', () => {
  const quizPage = document.querySelector('.quiz-page');
  if (quizPage) {
    new Quiz();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const answerPage = document.querySelector('.answer-page');
  if (answerPage) {
    new Answer().checkAnswer();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const resultPage = document.querySelector('.result-container');
  if (resultPage) {
    new Result().run();
  }
});
