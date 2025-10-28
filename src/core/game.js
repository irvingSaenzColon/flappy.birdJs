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
import ResourceLoader from "./resourceLoader.js";


const vertexShaderCode = `#version 300 es
precision mediump float; 
in vec2 v_position;
in vec2 a_texCoord;
uniform vec2 resolution;
uniform mat3 u_worldMatrix;
uniform mat3 u_projectionMatrix;
out vec2 v_texCoord;
void main() {
  vec3 worldPosition = u_worldMatrix * vec3(v_position, 1.0);
  vec3 clipSpace = u_projectionMatrix * worldPosition;
  v_texCoord = a_texCoord;
  gl_Position = vec4(clipSpace.xy, 0.0, 1.0); 
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
  static VIRTUAL_DIMENSIONS = {
    width: 360,
    height: 640,
  };
  static STATES = {
    "NONE": 0,
    "LOAD": 1,
    "START": 2,
    "READY": 3,
    "PLAY": 4,
    "PAUSE": 5,
    "DONE": 6,
    "STOP": 7,
  };
  #state = Game.STATES.NONE;
  //TODO Create a class that renders a scene, and doing everything inside scene instead of doing it all in game
  //TODO Refactor a function to calculate real dimension using dpr, remember to devide canvas dimension by dpr
  //TODO Get rid of that weird scroll of the page


  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    if (!canvas || !canvas instanceof HTMLCanvasElement) {
      throw new Error('A canvas mus be provided');
    }
    this.canvas = canvas;
    WebGL.initialize(canvas);
    //Define sound types
    this.soundType = {
      "JUMP": 1,
      "HIT": 2,
      "SCORE": 3
    }
    this.#state = Game.STATES.NONE;
    this.projectionMatrix = WebGL.getOrthogrpahicMatrix(0, Game.VIRTUAL_DIMENSIONS.width, 0, Game.VIRTUAL_DIMENSIONS.height);
  }


  onInit() {
    this.resize();
    this.background = new Background(Game.VIRTUAL_DIMENSIONS, `${CONFIG.TEXTURES_PATH}background/background.day.png`);
    this.ground = new Ground(Game.VIRTUAL_DIMENSIONS, `${CONFIG.TEXTURES_PATH}background/ground.png`);
    this.player = new Player(Game.VIRTUAL_DIMENSIONS, `${CONFIG.TEXTURES_PATH}bird/default/bird.midflap.png`);
    Obstacle.restartXLimitter = (Game.VIRTUAL_DIMENSIONS.width / Game.MAX_OBSTACLES) + Pipe.DEFAULT_WIDTH;
    this.obstacles = Array.from({ length: Game.MAX_OBSTACLES }, (_, i) => {
      let startPosition = Game.VIRTUAL_DIMENSIONS.width + (Obstacle.restartXLimitter * i);
      return new Obstacle(startPosition, Game.VIRTUAL_DIMENSIONS)
    });
    this.scoreSystem = new ScoreSystem(Game.VIRTUAL_DIMENSIONS);
  }


  async onLoadResources() {
    this.#state = Game.STATES.LOAD;
    const resourcesToLoad = [
      `${CONFIG.TEXTURES_PATH}background/background.day.png`,
      `${CONFIG.TEXTURES_PATH}background/ground.png`,
      `${CONFIG.TEXTURES_PATH}bird/default/bird.midflap.png`,
      `${CONFIG.TEXTURES_PATH}/numbers/numbers.png`,
      `${CONFIG.TEXTURES_PATH}pipe/pipe.green.png`,
    ];
    const resourcesImg = await ResourceLoader.getAllResources(resourcesToLoad);
    this.background.onLoadResources(resourcesImg[0]);
    this.ground.onLoadResources(resourcesImg[1]);
    this.player.onLoadResources(resourcesImg[2]);
    this.scoreSystem.onLoadResources(resourcesImg[3]);
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].onLoadResources(resourcesImg[4]);
    }
  }


  async setup() {
    this.background.render(vertexShaderCode, fragmentShaderSourceCode);
    this.ground.render(vertexShaderCode, fragmentShaderSourceCode);
    this.player.render(vertexShaderCode, fragmentShaderSourceCode);
    this.scoreSystem.render(vertexShaderCode, fragmentShaderSourceCode);
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].render(vertexShaderCode, fragmentShaderSourceCode);
    }
    //Setup sound effects
    SoundController.SOUND_FOLDER = './src/assets/sounds/';
    SoundController.createAudio(this.soundType.JUMP, "wing.wav");
    SoundController.createAudio(this.soundType.HIT, "hit.wav");
    SoundController.createAudio(this.soundType.SCORE, "point.wav");
    //Key bing setup
    this.keyBindings = {
      "Space": () => {
        this.#run();
      },
      "KeyR": () => {
        this.restart();
      }
    }
    this.#state = Game.STATES.READY;
    Input.setup(this.keyBindings);
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.#run();
    });
  }


  #run() {
    if (this.#state === Game.STATES.PAUSE || this.#state === Game.STATES.DONE || this.#state === Game.STATES.STOP) {
      return;
    }
    this.#state = Game.STATES.PLAY;
    SoundController.play(this.soundType.JUMP);
    this.player.jump();
  }


  resize() {
    const scale = 0.4;
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(this.canvas.clientWidth * dpr * scale);
    const displayHeight = Math.floor(this.canvas.clientHeight * dpr * scale);
    if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
    }
  }


  /**
   * @param {number} dt - Delta time, time elapsed since the game is launched
   */
  update(dt) {
    if (this.#state !== Game.STATES.PLAY && this.#state !== Game.STATES.STOP) {
      return;
    }
    // Clears color buffer
    WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0);
    //Clears depth buffer
    WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);
    // Rasterization
    WebGL.context.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
    this.background.update(this.projectionMatrix);
    this.obstacles.forEach(o => o.update(this.projectionMatrix));
    this.ground.update(this.projectionMatrix);
    this.player.update(this.projectionMatrix);
    //Collision detection
    if (this.ground.collider.isColliding(this.player.collider)) {
      this.player.gravity = 0;
      this.player.velocity.y = 0;
      this.#state = Game.STATES.DONE;
      if (!this.player.hitted) {
        this.player.hitted = true;
        SoundController.play(this.soundType.HIT);
      }
    }
    this.obstacles.forEach(o => {
      const isCollidingTop = o.pipeTop.collider.isColliding(this.player.collider);
      const isCollidingBottom = o.pipeBottom.collider.isColliding(this.player.collider)
      if (!this.player.hitted && (isCollidingTop == true || isCollidingBottom == true)) {
        Obstacle.speed = 0;
        this.#state = Game.STATES.STOP;
        this.player.hitted = true;
        SoundController.play(this.soundType.HIT);
      } else if (!o.gapHitted && o.gapCollider.isColliding(this.player.collider)) {
        o.gapHitted = true;
        ScoreSystem.increaseCounter();
        SoundController.play(this.soundType.SCORE);
      }
    });
    this.scoreSystem.update(this.projectionMatrix);
  }


  setState(newState) {
    if (!newState || (newState && !Game.STATES[newState])) {
      throw new Error("Error: current state doesn't exists, use a defined one");
    }
    this.#state = Game.STATES[newState];
  }


  getState() {
    return this.#state;
  }


  restart() {
    this.player.restart();
    this.obstacles.forEach((o, i) => {
      o.xStart = this.canvas.clientWidth + (Obstacle.restartXLimitter * i);
      o.restart();
    });
    Obstacle.speed = 150;
    ScoreSystem.reseyCounter();
    this.#state = Game.STATES.PLAY;
  }


  destroy() {
    this.player.destroy();
    this.obstacles.forEach(o => o.destroy());
    this.ground.destroy();
  }
}


export default Game;
