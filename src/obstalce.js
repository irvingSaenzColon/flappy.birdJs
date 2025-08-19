/** @import * as typedef from './typedef.js' */
import Pipe from "./pipe.js";


class Obstacle {
  static speed = 2.5;
  static yOffset = 200;
  static yLimitPos = {min: -200, max: 80};

  /**
   * @param {typedef.Dimension} canvasDimensions 
   */
  constructor(canvasDimensions) {
    this.canvasDimensions = canvasDimensions;
    const { bottomPos, topPos } = this.generatePosition()
    this.pipeBottom = new Pipe(bottomPos, canvasDimensions);
    this.pipeTop = new Pipe(topPos, canvasDimensions);
  }


  /**
   * @param { String } vertexShaderCode 
   * @param { String } fragmentShaderCode 
   */
  render(vertexShaderCode, fragmentShaderCode) {
    this.pipeBottom.render(vertexShaderCode, fragmentShaderCode);
    this.pipeTop.render(vertexShaderCode, fragmentShaderCode);
  }


  update() {
    if(this.pipeBottom.position.x < - Pipe.DEFAULT_WIDTH) {
      const {bottomPos, topPos} = this.generatePosition();
      this.pipeBottom.position = bottomPos;
      this.pipeTop.position = topPos;
    } else {
      this.pipeBottom.position.x -= Obstacle.speed;
      this.pipeTop.position.x -= Obstacle.speed; 
    }
    this.pipeBottom.update();
    this.pipeTop.update();
  }


  generatePosition() {
    const yPossBott = Math.floor(Math.random() * (Obstacle.yLimitPos.max - Obstacle.yLimitPos.min + 1) + Obstacle.yLimitPos.min);
    const xStartPos = (this.canvasDimensions.width + Pipe.DEFAULT_WIDTH);
    return {
      bottomPos: {x: xStartPos, y: yPossBott},
      topPos: {x: xStartPos, y: (yPossBott + Obstacle.yOffset + Pipe.DEFAULT_HEIGHT) }
    } 
  }


  destroy() {
    this.pipeBottom.destroy();
    this.pipeTop.destroy();
  }
}


export default Obstacle;