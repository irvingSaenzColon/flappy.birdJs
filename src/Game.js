import WebGL from "./webGL.js";
import Ground from "./ground.js";
import Obstacle from "./obstalce.js";
import Player from "./player.js";
import Pipe from "./pipe.js";


const vertexShaderCode = `#version 300 es
precision mediump float; 
in vec2 v_position;
uniform vec2 resolution;
uniform mat3 u_worldMatrix;
void main() {
  vec3 worldPosition = u_worldMatrix * vec3(v_position, 1.0);
  vec2 clipSpace = ((worldPosition.xy / resolution) * 2.0) - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0); 
}`;
const fragmentShaderSourceCode = `#version 300 es
precision mediump float; 
out vec4 outputColor;
uniform vec4 u_color;
void main() {
  outputColor = u_color;
}`;


class Game {
  static MAX_OBSTACLES = 3 ;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    const canvasDimensions = {
      width: canvas.clientWidth, 
      height: canvas.clientHeight
    };
    WebGL.initialize(canvas);
    this.player = new Player(null, canvasDimensions);
    Obstacle.restartXLimitter = (canvasDimensions.width / Game.MAX_OBSTACLES) + Pipe.DEFAULT_WIDTH;
    this.obstacles = Array.from({ length: Game.MAX_OBSTACLES }, (_, i) => {
      let startPosition = canvasDimensions.width;
      if(i) {
        startPosition = startPosition + (Obstacle.restartXLimitter * i);
      }
      return new Obstacle(startPosition , canvasDimensions)
    });
    this.ground = new Ground(canvasDimensions);
  }


  render() {
    this.player.render(vertexShaderCode, fragmentShaderSourceCode);
    this.obstacles.forEach(o => o.render(vertexShaderCode, fragmentShaderSourceCode));
    this.ground.render(vertexShaderCode, fragmentShaderSourceCode);
  }


  /**
   * @param {number} dt - Delta time, time elapsed since the game is launched
   */
  update(dt) {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    // Clears color buffer
    WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0);
    //Clears depth buffer
    WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);
    // Rasterization
    WebGL.context.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
    this.player.update();
    this.obstacles.forEach(o => o.update());
    this.ground.update();
    if(this.ground.collider.isColliding(this.player.collider)) {
      this.restart();
    }
    this.obstacles.forEach(o => {
      if(o.pipeTop.collider.isColliding(this.player.collider) || o.pipeBottom.collider.isColliding(this.player.collider)) {
        console.log("Restart");
      } else if(o.gapCollider.isColliding(this.player.collider)) {
        console.log('Gana 1 punto');
      }
    });
  }


  restart() {
    this.player.restart();
  }


  destroy() {
    this.player.destroy();
    this.obstacles.forEach(o => o.destroy());
    this.ground.destroy();
  }
}


export default Game;