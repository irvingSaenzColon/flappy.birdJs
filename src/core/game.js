import WebGL from "./webGL.js";
import Ground from "../objects/ground.js";
import Obstacle from "../objects/obstalce.js";
import Player from "../objects/player.js";
import Pipe from "../objects/pipe.js";
import Input from "./input.js";
import SoundController from "./sound.js";


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
    if(!canvas || !canvas instanceof HTMLCanvasElement) {
      throw new Error('A canvas mus be provided');
    }
    this.canvas = canvas;
    const canvasDimensions = {
      width: canvas.clientWidth, 
      height: canvas.clientHeight
    };
    WebGL.initialize(canvas);
    this.player = new Player(null, canvasDimensions);
    Obstacle.restartXLimitter = (canvasDimensions.width / Game.MAX_OBSTACLES) + Pipe.DEFAULT_WIDTH;
    this.obstacles = Array.from({ length: Game.MAX_OBSTACLES }, (_, i) => {
      let startPosition = canvasDimensions.width + (Obstacle.restartXLimitter * i);
      return new Obstacle(startPosition , canvasDimensions)
    });
    this.ground = new Ground(canvasDimensions);
    this.keyBindings = {
      "Space": () => {
        if(this.pause || this.player.hitted) {
          return;
        }
        SoundController.play(SoundController.SOUND_TYPE.JUMP);
        this.player.jump();
      },
      "KeyR": () => {
        this.restart();
      }
    }
    Input.setup(this.keyBindings);
    this.score = 0;
    this.stop = false;
    this.pause = false;
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
    if(this.stop) {
      return;
    }
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    // Clears color buffer
    WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0);
    //Clears depth buffer
    WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);
    // Rasterization
    WebGL.context.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
    this.obstacles.forEach(o => o.update());
    this.player.update();
    this.ground.update();
    if(this.ground.collider.isColliding(this.player.collider)) {
      this.player.gravity = 0;
      this.stop = true;
      if(!this.player.hitted) {
        this.player.hitted = true;
        SoundController.play(SoundController.SOUND_TYPE.HIT);
      }
    }
    this.obstacles.forEach(o => {
      if(!this.player.hitted && (o.pipeTop.collider.isColliding(this.player.collider) || o.pipeBottom.collider.isColliding(this.player.collider))) {
        Obstacle.speed = 0;
        this.player.hitted = true;
        SoundController.play(SoundController.SOUND_TYPE.HIT);
      } else if(!o.gapHitted && o.gapCollider.isColliding(this.player.collider)) {
        this.score++;
        o.gapHitted = true;
        SoundController.play(SoundController.SOUND_TYPE.SCORE);
        console.log('Score is: ', this.score);
      }
    });
  }


  restart() {
    this.player.restart();
    this.obstacles.forEach((o, i) => {
      o.xStart = this.canvas.clientWidth + (Obstacle.restartXLimitter * i);
      o.restart() ;
    });
    Obstacle.speed = 2.5;
    this.score = 0;
    this.stop = false;
  }


  destroy() {
    this.player.destroy();
    this.obstacles.forEach(o => o.destroy());
    this.ground.destroy();
  }
}


export default Game;