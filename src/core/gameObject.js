/** @import * as typedef from './typedef.js' */
import Collider from '../collision/collider.js';
import Matrix from './matrix.js';
import ShaderHandler from './shaderHandler.js';


class GameObject {


  /**
   * @param { Array<Number>} vertex
   * @param { Array<Number> } texture
   * @param { Objec} shaderParams
   * @param { typedef.Vec2 } position
   * @param { Number } rotation
   * @param { typedef.Vec2 } scale
   * @param { Object } shaderParams
   * @param { Number } gravity
   * @param { typedef.Dimension } canvasDimensions
   */
  constructor(vertex, texture, position, rotation, scale, shaderParams, gravity = 0.98, canvasDimensions) {
    this.vertex = vertex;
    this.position = position;
    this.roation = rotation;
    this.scale = scale;
    this.gravity = gravity;
    this.velocity = {x: 0, y: 0};
    this.canvasDimensions = canvasDimensions;
    this.shader = new ShaderHandler(shaderParams, texture);
    this.wordlMatrix = Matrix.identity();
    this.collider = new Collider();
  }


  update() {
    if(this.gravity) {
      this.velocity.y -= this.gravity;
      this.position.y += this.velocity.y;
    }
    this.collider.update(this.position);
    this.calculateWorldMatrix();
    this.shader.update(this.vertex, this.canvasDimensions, this.wordlMatrix);
  }


  calculateWorldMatrix() {
    this.wordlMatrix = Matrix.identity();
    const scaleM = Matrix.scaleMatrix(this.scale);
    const rotationM = Matrix.rotationMatrix(this.roation);
    const translateM = Matrix.traslateMatrix(this.position);
    this.wordlMatrix = Matrix.multiply3x3Matrix(this.wordlMatrix, scaleM);
    this.wordlMatrix = Matrix.multiply3x3Matrix(rotationM, this.wordlMatrix);
    this.wordlMatrix = Matrix.multiply3x3Matrix(translateM, this.wordlMatrix);
  }



  render(vertexShaderCode, fragmentShaderCode) {
    this.shader.render(vertexShaderCode, fragmentShaderCode);
  }


  destroy() {
    this.shader.destroy();
  }
}

export default GameObject;