/** @import * as typedef from './typedef.js' */
import { plane } from "./figures.js";
import GameObject from "./gameObject.js";


class Ground extends GameObject {


  /**
   * @param {typedef.Dimension} canvasDimensions 
   */
  constructor(canvasDimensions) {
    const vertex = plane(canvasDimensions.width, 80);
    const scale = { x: 1, y: 1};
    const translate = { x: 0, y: 0};
    const rotation = 0;
    super(vertex, null, translate, rotation, scale, null, null, canvasDimensions);
  }
}


export default Ground;