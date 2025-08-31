class Timer {
  static #deltaTime = 0;
  static #prevTime = 0;


  /**
   * @param { Number } currTime
   */
  static setPrevTime(currTime) {
    if(currTime) {
      this.#deltaTime = currTime - this.#prevTime;
      this.#prevTime = currTime;
    } else {
      this.#deltaTime = currTime;
      this.#prevTime = 0;
    }
  }


  static getDelta() {
    return this.#deltaTime / 1000;
  }
}


export default Timer;