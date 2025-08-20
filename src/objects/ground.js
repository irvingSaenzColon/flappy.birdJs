/** @import * as typedef from '../core/typedef.js' */
import BoxCollider from "../collision/boxCollider.js";
import { plane } from "../figures.js";
import GameObject from "../core/gameObject.js";


class Ground extends GameObject {


  /**
   * @param {typedef.Dimension} canvasDimensions 
   */
  constructor(canvasDimensions) {
    const width = canvasDimensions.width;
    const height = 80;
    const vertex = plane(canvasDimensions.width, height);
    const scale = { x: 1, y: 1};
    const translate = { x: 0, y: 0};
    const rotation = 0;
    super(vertex, null, translate, rotation, scale, null, null, canvasDimensions);
    this.collider = new BoxCollider(0, 0, width, height);
    this.static = true;
  }
}


export default Ground;