/** @import * as typedef from '../core/typedef.js' */
import Timer from "../core/Timer.js";
import BoxCollider from "../collision/boxCollider.js";
import Pipe from "./pipe.js";
import CONFIG from "../config.js";


class Obstacle {
  static speed = 150;
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
    const pipeTexturePath = `${CONFIG.TEXTURES_PATH}pipe/pipe.green.png`;
    this.pipeBottom = new Pipe(canvasDimensions, pipeTexturePath);
    this.pipeBottom.mesh.setPosition(bottomPos);
    this.pipeTop = new Pipe(canvasDimensions, pipeTexturePath);
    this.pipeTop.mesh.setPosition(topPos);
    this.pipeTop.mesh.flipTexCoord();
    this.gapPosition = gapPos;
    this.gapHitted = false;
    this.gapCollider = new BoxCollider(0, 0, (Pipe.DEFAULT_WIDTH / 2), Obstacle.yOffset);
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
    if(this.pipeBottom.mesh.transform.translate.x < -((Pipe.DEFAULT_WIDTH / 2) + Obstacle.restartXLimitter)) {
      this.xStart = this.canvasDimensions.width;
      this.restart();
    } else {
      this.pipeBottom.mesh.transform.translate.x -= (Obstacle.speed * Timer.getDelta());
      this.pipeTop.mesh.transform.translate.x -= (Obstacle.speed * Timer.getDelta());
      this.gapPosition.x -= (Obstacle.speed * Timer.getDelta());
    }
    this.pipeBottom.update();
    this.pipeTop.update();
    this.gapCollider.update(this.gapPosition);
  }


  restart() {
    const {bottomPos, topPos, gapPos} = this.generatePosition();
    this.pipeBottom.mesh.setPosition(bottomPos);
    this.pipeTop.mesh.setPosition(topPos);
    this.gapPosition = gapPos;
    this.gapHitted = false;
  }


  generatePosition() {
    const yPossBott = Math.floor(Math.random() * (Obstacle.yLimitPos.max - Obstacle.yLimitPos.min + 1) + Obstacle.yLimitPos.min);
    const xStartPos = ( this.xStart );
    return {
      bottomPos: {x: xStartPos, y: yPossBott},
      topPos: {x: xStartPos, y: (yPossBott + Obstacle.yOffset + Pipe.DEFAULT_HEIGHT) },
      gapPos: {x: (xStartPos + (Pipe.DEFAULT_WIDTH / 2)), y: (yPossBott + Pipe.DEFAULT_HEIGHT )}
    } 
  }


  destroy() {
    this.pipeBottom.destroy();
    this.pipeTop.destroy();
  }
}


export default Obstacle;