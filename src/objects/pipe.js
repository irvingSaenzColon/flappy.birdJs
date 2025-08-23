/** @import * as typedef from './typedef.js' */
import GameObject from "../core/gameObject.js";
import BoxCollider from "../collision/boxCollider.js";
import Plane from "../core/plane.js";


class Pipe extends GameObject {
  static DEFAULT_WIDTH = 120;
  static DEFAULT_HEIGHT = 400;


  /**
   * @param { typedef.Dimension } canvasDimensions 
   * @param { String } texture
   */
  constructor(canvasDimensions, texture) {
    super(texture, null, null, canvasDimensions);
    const tranform = {
      translate: {x: 0, y: 0},
      scale: {x: 1, y: 1},
      rotation: 0,
    }
    this.mesh = new Plane(Pipe.DEFAULT_WIDTH, Pipe.DEFAULT_HEIGHT, tranform);
    this.collider = new BoxCollider(0, 0, Pipe.DEFAULT_WIDTH, Pipe.DEFAULT_HEIGHT);
  }
}


export default Pipe;