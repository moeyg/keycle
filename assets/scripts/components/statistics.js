export default class Statistics {
  saveIncorrectRate(incorrectRate) {
    localStorage.setItem('incorrectRate', JSON.stringify(incorrectRate));
  }

  updateChallengerCount(challenger) {
    const challengerCount = document.querySelector('#challenger-count');
    challengerCount.innerText = challenger;
  }

  getStatistics() {
    return fetch('https://3.37.238.149.nip.io/stats/incorrectRate')
      .then((response) => {
        if (!response.ok) {
          throw new Error('서버에서 데이터를 가져오지 못했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        const dataArray = Array.from(data.incorrectRate);
        const challenger = dataArray[0];
        const incorrectRate = dataArray.slice(1);
        this.saveIncorrectRate(incorrectRate);
        this.updateChallengerCount(challenger);
        return { challenger, incorrectRate };
      })
      .catch((error) => {
        console.error('데이터 가져오기 실패:', error);
      });
  }
}
