/** @import * as typedef from './Types.js' */
import ShaderHandler from './shaderHandler.js';



class GameObject {


  /**
   * @param { Array<Number>} vertex
   * @param { Objec} shaderParams
   * @param { Array<Number> } position
   * @param { Array<Number> } rotation
   * @param { Array<Number> } scale
   * @param { Object } shaderParams
   * @param { Number } gravity
   * @param { typedef.Dimension } canvasDimensions
   */
  constructor(vertex, position, rotation, scale, shaderParams, gravity = 0.98, canvasDimensions) {
    this.vertex = vertex;
    this.position = position;
    this.roation = rotation;
    this.scale = scale;
    this.gravity = gravity;
    this.velocity = {x: 0, y: 0};
    this.canvasDimensions = canvasDimensions;
    this.shader = new ShaderHandler(shaderParams);
  }


  update() {
    /*
    if(this.gravity) {
      this.velocity.y -= this.gravity;
      for(let i = 0; i < this.vertex.length; i++) {
        if(i % 2 == 1) {
          this.vertex[i] += this.velocity.y;
        }
      }
    }
      */
    this.shader.update(this.vertex, this.canvasDimensions, [0.92, 0.2, 0.7, 1]);
  }


  render(vertexShaderCode, fragmentShaderCode) {
    this.shader.render(vertexShaderCode, fragmentShaderCode);
  }


  destroy() {
    this.shader.destroy();
  }
}

export default GameObject;