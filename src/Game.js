import WebGL from "./WebGL";

class Game {
  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   */
  static initialize(canvas) {
    WebGL.initialize(canvas);
  }


  /**
   * @param {number} dt - Delta time, time elapsed since the game is launched
   */
  static update(dt) {

  }
}


export default Game;