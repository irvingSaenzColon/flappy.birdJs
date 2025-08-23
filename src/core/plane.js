/** @import * as typedef from '../core/typedef.js' */
import Mesh from "./mesh.js";


class Plane extends Mesh {
  

  /**
   * @param { Number } width 
   * @param { Number } height 
   * @param { typedef.Transform } tranform 
   */
  constructor(width, height, tranform) {
    super(tranform);
    this.center = {
      x: width / 2,
      y: height / 2,
    };
    this.vertex = this.#setupMeshGeometry();
    this.textureCoordinates = this.#setupTexCoord();
    this.transform.translate.x = this.transform.translate.x + this.center.x;
    this.transform.translate.y = this.transform.translate.y + this.center.y;
  }


  /**
   * Generates basic vertex geometry for a plane
   * @returns { Float32Array }
   */
  #setupMeshGeometry() {
    return new Float32Array([
      - this.center.x, - this.center.y,
      this.center.x, - this.center.y,
      - this.center.x, this.center.y,
      - this.center.x, this.center.y,
      this.center.x, - this.center.y,
      this.center.x, this.center.y
    ]);
  }


  /**
   * @param { typedef.Vec2 } position 
   */
  setPosition(position) {
    this.transform.translate.x = position.x + this.center.x;
    this.transform.translate.y = position.y + this.center.y;
  }


  /**
   * @returns { Float32Array }
   */
  #setupTexCoord() {
    return new Float32Array([
      0.0, 1.0,
      1.0, 1.0,
      0.0, 0.0,
      0.0, 0.0,
      1.0, 1.0,
      1.0, 0.0,
    ]);
  };


  flipTexCoord() {
    this.textureCoordinates = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0,
    ]);
  }
}


export default Plane;