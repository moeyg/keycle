// Import
import Quiz from './components/quiz.js';
import Answer from './components/answer.js';
import Result from './components/result.js';
import Timer from './components/timer.js';
import Statistics from './components/statistics.js';
import IncorrectRate from './components/incorrectRate.js';
import Photo from './components/photo.js';

document.addEventListener('DOMContentLoaded', () => {
  const challenger = document.querySelector('#challenger-count');
  if (challenger) {
    new Statistics().getStatistics();
  }

  const indexPage = document.querySelector('#index-container');
  if (indexPage) {
    localStorage.clear();
  }

  const quizPage = document.querySelector('.quiz-page');
  if (quizPage) {
    new Quiz();
    new Timer().startTimer();
  }

  const answerPage = document.querySelector('.answer-page');
  if (answerPage) {
    new Answer().checkAnswer();
  }

  const commentaryPage = document.querySelector('.commentary-page');
  if (commentaryPage) {
    new IncorrectRate().setIncorrectRate();
  }

  const resultPage = document.querySelector('.result-container');
  if (resultPage) {
    new Result().run();
  }

  const photoPage = document.querySelector('.photo-container');
  if (photoPage) {
    // 카메라 접근
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        camera.srcObject = stream;
      })
      .catch((error) => {
        console.error('카메라 접근 에러:', error);
      });

    new Photo();
  }
});
