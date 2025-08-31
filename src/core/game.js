import WebGL from "./webGL.js";
import CONFIG from "../config.js";
import Ground from "../objects/ground.js";
import Obstacle from "../objects/obstalce.js";
import Player from "../objects/player.js";
import Pipe from "../objects/pipe.js";
import Input from "./input.js";
import SoundController from "./sound.js";
import Background from "../objects/background.js";
import ScoreSystem from "../UI/scoreSystem.js";


const vertexShaderCode = `#version 300 es
precision mediump float; 
in vec2 v_position;
in vec2 a_texCoord;
uniform vec2 resolution;
uniform mat3 u_worldMatrix;
out vec2 v_texCoord;
void main() {
  vec3 worldPosition = u_worldMatrix * vec3(v_position, 1.0);
  vec2 clipSpace = ((worldPosition.xy / resolution) * 2.0) - 1.0;
  v_texCoord = a_texCoord;
  gl_Position = vec4(clipSpace, 0.0, 1.0); 
}`;
const fragmentShaderSourceCode = `#version 300 es
precision mediump float;
in vec2 v_texCoord;
out vec4 outputColor;
uniform vec4 u_color;
uniform sampler2D u_texture;
void main() {
  vec4 textureColor = texture(u_texture, v_texCoord);
  vec3 keyColor = vec3(0.015686, 0.988235, 0.015686);
  float threshold = 0.4;
  if (distance(textureColor.rgb, keyColor) < threshold) {
    discard;
  }
  outputColor = textureColor;
}`;


class Game {
  static MAX_OBSTACLES = 3;
  static CANVAS_DIMENSIONS = {
    width: 0,
    height: 0,
  };


  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    if(!canvas || !canvas instanceof HTMLCanvasElement) {
      throw new Error('A canvas mus be provided');
    }
    this.canvas = canvas;
    Game.CANVAS_DIMENSIONS.width = canvas.clientWidth;
    Game.CANVAS_DIMENSIONS.height = canvas.clientHeight;
    const canvasDimensions = {
      width: canvas.clientWidth, 
      height: canvas.clientHeight
    };
    WebGL.initialize(canvas);
    this.background = new Background(canvasDimensions, `${CONFIG.TEXTURES_PATH}background/background.day.png`);
    this.ground = new Ground(canvasDimensions, `${CONFIG.TEXTURES_PATH}background/ground.png`);
    this.player = new Player(canvasDimensions, `${CONFIG.TEXTURES_PATH}bird/default/bird.midflap.png`);
    Obstacle.restartXLimitter = (canvasDimensions.width / Game.MAX_OBSTACLES) + Pipe.DEFAULT_WIDTH;
    this.obstacles = Array.from({ length: Game.MAX_OBSTACLES }, (_, i) => {
      let startPosition = canvasDimensions.width + (Obstacle.restartXLimitter * i);
      return new Obstacle(startPosition , canvasDimensions)
    });
    this.scoreSystem = new ScoreSystem();
    // Sound setup
    this.soundType = {
      "JUMP": 1,
      "HIT": 2,
      "SCORE": 3
    }
    SoundController.SOUND_FOLDER = './src/assets/sounds/';
    SoundController.createAudio(this.soundType.JUMP, "wing.wav");
    SoundController.createAudio(this.soundType.HIT, "hit.wav");
    SoundController.createAudio(this.soundType.SCORE, "point.wav");
    //Key bing setup
    this.keyBindings = {
      "Space": () => {
        if(this.pause || this.player.hitted) {
          return;
        }
        SoundController.play(this.soundType.JUMP);
        this.player.jump();
      },
      "KeyR": () => {
        this.restart();
      }
    }
    Input.setup(this.keyBindings);
    this.stop = false;
    this.pause = false;
  }


  async render() {
    await this.player.render(vertexShaderCode, fragmentShaderSourceCode);
    await this.background.render(vertexShaderCode, fragmentShaderSourceCode);
    await this.ground.render(vertexShaderCode, fragmentShaderSourceCode);;
    await this.scoreSystem.render(vertexShaderCode, fragmentShaderSourceCode);
    for(let i = 0; i < this.obstacles.length; i++) {
      await this.obstacles[i].render(vertexShaderCode, fragmentShaderSourceCode);
    }
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
    this.background.update();
    this.obstacles.forEach(o => o.update());
    this.ground.update();
    this.player.update();
    if(this.ground.collider.isColliding(this.player.collider)) {
      this.player.gravity = 0;
      this.player.velocity.y = 0;
      this.stop = true;
      if(!this.player.hitted) {
        this.player.hitted = true;
        SoundController.play(this.soundType.HIT);
      }
    }
    this.obstacles.forEach(o => {
      const isCollidingTop = o.pipeTop.collider.isColliding(this.player.collider);
      const isCollidingBottom = o.pipeBottom.collider.isColliding(this.player.collider)
      if(!this.player.hitted && (isCollidingTop == true || isCollidingBottom == true)) {
        Obstacle.speed = 0;
        this.player.hitted = true;
        SoundController.play(this.soundType.HIT);
      } else if(!o.gapHitted && o.gapCollider.isColliding(this.player.collider)) {
        o.gapHitted = true;
        ScoreSystem.increaseCounter();
        SoundController.play(this.soundType.SCORE);
      }
    });
    this.scoreSystem.update();
  }


  restart() {
    this.player.restart();
    this.obstacles.forEach((o, i) => {
      o.xStart = this.canvas.clientWidth + (Obstacle.restartXLimitter * i);
      o.restart() ;
    });
    Obstacle.speed = 150;
    ScoreSystem.reseyCounter();
    this.stop = false;
  }


  destroy() {
    this.player.destroy();
    this.obstacles.forEach(o => o.destroy());
    this.ground.destroy();
  }
}


export default Game;