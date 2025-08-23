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
    this.vertex = this.#setupMeshGeometry(width, height);
    this.textureCoordinates = this.#setupTexCoord();
  }


  /**
   * Generates basic vertex geometry for a plane
   * @param { Number } width 
   * @param { Number } height 
   * @returns { Float32Array }
   */
  #setupMeshGeometry(width, height) {
    return new Float32Array([
      0.0, 0.0,
      width, 0.0,
      0.0, height,
      0.0, height,
      width, 0.0,
      width, height
    ]);
  }


  /**
   * 
   * @param { typedef.Vec2 } position 
   */
  setPosition(position) {
    this.transform.translate = position;
  }


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