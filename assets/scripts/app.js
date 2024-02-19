// Import
import Quiz from './components/quiz.js';
import Answer from './components/answer.js';
import Result from './components/result.js';
import Timer from './components/timer.js';
import Statistics from './components/statistics.js';
import Photo from './components/photo.js';

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

document.addEventListener('DOMContentLoaded', () => {
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
