/** @import * as typedef from '../core/typedef.js' */
import BoxCollider from "../collision/boxCollider.js";
import GameObject from "../core/gameObject.js";
import Plane from "../core/plane.js";


class Player extends GameObject {


  /**
   * 
   * @param { typedef.Vec2 } position 
   * @param { String } texture 
   */
  constructor(canvasDimensions, texture) {
    super(texture, null, 2500, canvasDimensions, true);
    const width = 54;
    const height = 44;
    const transform = {
      translate: { x: 100, y: 450 },
      scale: { x: 1, y: 1 },
      rotation: 315,
    }
    this.mesh = new Plane(width, height, transform)
    this.collider = new BoxCollider(-this.mesh.center.x, -this.mesh.center.y, this.mesh.center.x, this.mesh.center.y);
    this.hitted = false;
  }


  restart() {
    this.hitted = false;
    this.gravity = 2500;
    this.mesh.transform.translate = { x: 100, y: 450 };
    this.velocity.x = 0;
    this.velocity.y = 0;
  }


  jump() {
    this.velocity.y = 625;
    this.mesh.transform.rotation = 315;
  }


  destroy() {
    Input.destroy();
    this.shader.destroy();
  }
}


export default Player;
