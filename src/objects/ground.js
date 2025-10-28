/** @import * as typedef from '../core/typedef.js' */
import BoxCollider from "../collision/boxCollider.js";
import GameObject from "../core/gameObject.js";
import Plane from "../core/plane.js";


class Ground extends GameObject {
  static GROUND_HEIGHT = 80;

  /**
   * @param { typedef.Dimension } canvasDimensions 
   * @param { String } textureName
   */
  constructor(canvasDimensions, textureName) {
    super(textureName, null, null, canvasDimensions, true);
    const width = canvasDimensions.width;
    const transform = {
      translate: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
      rotation: 0,
    }
    this.mesh = new Plane(width, Ground.GROUND_HEIGHT, transform);
    this.collider = new BoxCollider(-this.mesh.center.x, -this.mesh.center.y, this.mesh.center.x, this.mesh.center.y);
  }
}


export default Ground;
