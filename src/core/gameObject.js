/** @import * as typedef from './typedef.js' */
import Collider from '../collision/collider.js';
import ShaderHandler from './shaderHandler.js';
import Mesh from './mesh.js';
import Texture from './texture.js';


class GameObject {


  /**
   * @param { String } textureName
   * @param { Objec} shaderParams
   * @param { Number } gravity
   * @param { typedef.Dimension } canvasDimensions
   * @param { Boolean } shouldCollide
   */
  constructor(textureName, shaderParams, gravity = 0.98, canvasDimensions, shouldCollide) {
    this.mesh = new Mesh();
    this.gravity = gravity;
    this.velocity = {x: 0, y: 0};
    this.canvasDimensions = canvasDimensions;
    this.collider = null;
    if(shouldCollide) {
      this.collider = new Collider();
    }
    this.texture = new Texture(textureName, this.textureCoordinates);
    this.shader = new ShaderHandler(shaderParams, this.texture);
  }


  update() {
    if(this.gravity) {
      this.velocity.y -= this.gravity;
      if(this.mesh.transform.rotation < 450) {
        this.mesh.transform.rotation += 2.5;
      }
      this.mesh.applyVelocity(this.velocity);
    }
    if(this.collider) {
      this.collider.update(this.mesh.transform.translate);
    }
    this.mesh.calculateTransform();
    this.shader.update(this.mesh.vertex, this.mesh.textureCoordinates, this.canvasDimensions, this.mesh.worldMatrix);
  }


  render(vertexShaderCode, fragmentShaderCode) {
    this.shader.render(vertexShaderCode, fragmentShaderCode, this.mesh.vertex, this.mesh.textureCoordinates);
  }


  destroy() {
    this.shader.destroy();
  }
}

export default GameObject;