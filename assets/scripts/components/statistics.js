export default class Statistics {
  saveIncorrectRate(incorrectRate) {
    localStorage.setItem('incorrectRate', JSON.stringify(incorrectRate));
  }

  updateChallengerCount(challenger) {
    const challengerCount = document.querySelector('#challenger-count');
    challengerCount.innerText = challenger;
  }

  async getStatistics() {
    try {
      const response = await fetch(
        'https://3.37.238.149.nip.io/stats/incorrectRate'
      );
      if (!response.ok) {
        throw new Error('네트워크 응답 에러');
      }
      const data = await response.json();
      const datas = Array.from(data.incorrectRate);
      const challenger = datas[0];
      const incorrectRate = datas.slice(1);
      this.saveIncorrectRate(incorrectRate);
      this.updateChallengerCount(challenger);
    } catch (error) {
      console.log(error);
      throw new Error('데이터 가져오기 실패');
    }
  }
}
