// Import
import Quiz from './components/quiz.js';
import Answer from './components/answer.js';
import Result from './components/result.js';
import Timer from './components/timer.js';
import Statistics from './components/statistics.js';

document.addEventListener('DOMContentLoaded', () => {
  const challenger = document.querySelector('#challenger-count');
  if (challenger) {
    new Statistics().getStatistics();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const quizPage = document.querySelector('.quiz-page');
  if (quizPage) {
    new Quiz();
    new Timer().startTimer();
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
