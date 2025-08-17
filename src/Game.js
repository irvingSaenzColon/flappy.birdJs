import WebGL from "./WebGL.js";
import Player from "./player.js";
const vertexShaderCode = `#version 300 es
precision mediump float; 
in vec2 v_position;
uniform vec2 resolution;
void main() {
  vec2 clipSpace = ((v_position / resolution) * 2.0) - 1.0;
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


  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    WebGL.initialize(canvas);
    this.player = new Player([0, 0], [0, 0], [0, 0], null, {width: canvas.clientWidth, height: canvas.clientHeight});
  }


  render() {
    this.player.render(vertexShaderCode, fragmentShaderSourceCode);
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

    // Rasterization - which pixels are part of a triangle
    WebGL.context.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
    this.player.update();
  }


  destroy() {
    this.player.destroy();
  }
}


export default Game;