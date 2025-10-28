/** @import * as typedef from '../core/typedef.js' */
import GameObject from "../core/gameObject.js";
import Plane from "../core/plane.js";
import Ground from "./ground.js";


class Background extends GameObject {


  /**
   * @param { typedef.Dimension } canvasDimensions 
   * @param { String } texture 
   */
  constructor(canvasDimensions, texture) {
    super(texture, null, null, canvasDimensions);
    const width = canvasDimensions.width;
    const height = canvasDimensions.height - Ground.GROUND_HEIGHT;
    const transform = {
      translate: { x: 0, y: Ground.GROUND_HEIGHT },
      scale: { x: 1, y: 1 },
      rotation: 0,
    }
    this.mesh = new Plane(width, height, transform);
  }
}


export default Background;
