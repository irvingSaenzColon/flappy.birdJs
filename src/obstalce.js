/** @import * as typedef from './typedef.js' */
import BoxCollider from "./boxCollider.js";
import Pipe from "./pipe.js";


class Obstacle {
  static speed = 2.5;
  static yOffset = 200;
  static yLimitPos = {min: -200, max: 80};
  static restartXLimitter = 0;


  /**
   * @param {typedef.Dimension} canvasDimensions 
   */
  constructor(xStart, canvasDimensions) {
    this.xStart = xStart;
    this.canvasDimensions = canvasDimensions;
    const { bottomPos, topPos, gapPos } = this.generatePosition()
    this.pipeBottom = new Pipe(bottomPos, canvasDimensions);
    this.pipeTop = new Pipe(topPos, canvasDimensions);
    this.gapPosition = gapPos ;
    this.gapCollider = new BoxCollider(0, 0, Pipe.DEFAULT_WIDTH, Obstacle.yOffset);
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
    if(this.pipeBottom.position.x < -((Pipe.DEFAULT_WIDTH / 2) + Obstacle.restartXLimitter)) {
      this.xStart = this.canvasDimensions.width;
      const {bottomPos, topPos, gapPos} = this.generatePosition();
      this.pipeBottom.position = bottomPos;
      this.pipeTop.position = topPos;
      this.gapPosition = gapPos;
    } else {
      this.pipeBottom.position.x -= Obstacle.speed;
      this.pipeTop.position.x -= Obstacle.speed;
      this.gapPosition.x -= Obstacle.speed;
    }
    this.pipeBottom.update();
    this.pipeTop.update();
    this.gapCollider.update(this.gapPosition);
  }


  generatePosition() {
    const yPossBott = Math.floor(Math.random() * (Obstacle.yLimitPos.max - Obstacle.yLimitPos.min + 1) + Obstacle.yLimitPos.min);
    const xStartPos = ( this.xStart );
    return {
      bottomPos: {x: xStartPos, y: yPossBott},
      topPos: {x: xStartPos, y: (yPossBott + Obstacle.yOffset + Pipe.DEFAULT_HEIGHT) },
      gapPos: {x: xStartPos, y: (yPossBott + Pipe.DEFAULT_HEIGHT )}
    } 
  }


  destroy() {
    this.pipeBottom.destroy();
    this.pipeTop.destroy();
  }
}


export default Obstacle;