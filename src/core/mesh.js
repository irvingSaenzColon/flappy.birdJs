/** @import * as typedef from '../core/typedef.js' */
import Matrix from "./matrix.js";
import Timer from "./Timer.js";


class Mesh {


  /**
   * 
   * @param { typedef.Transform } transform 
   */
  constructor(transform) {
    this.vertex = [];
    this.textureCoordinates = [];
    this.transform = transform
    this.worldMatrix = Matrix.identity();
  }


  /**
   * apply a velocity to translate vector
   * @param { typedef.Vec2 } velocity 
   */
  applyVelocity(velocity) {
    this.transform.translate.y += (velocity.y * Timer.getDelta());
  }


  calculateTransform() {
    this.worldMatrix = Matrix.identity();
    const scaleM = Matrix.scaleMatrix(this.transform.scale);
    const rotationM = Matrix.rotationMatrix(this.transform.rotation);
    const translateM = Matrix.traslateMatrix(this.transform.translate);
    const SR = Matrix.multiply3x3Matrix(scaleM, rotationM);
    this.worldMatrix = Matrix.multiply3x3Matrix(SR, translateM);
  }
}


export default Mesh;
