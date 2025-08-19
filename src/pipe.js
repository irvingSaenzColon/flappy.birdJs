/** @import * as typedef from './typedef.js' */
import BoxCollider from "./boxCollider.js";
import { plane } from "./figures.js";
import GameObject from "./gameObject.js";


class Pipe extends GameObject {
  static DEFAULT_WIDTH = 120;
  static DEFAULT_HEIGHT = 400;


  /**
   * @param {typedef.Vec2} position
   * @param {typedef.Dimension} canvasDimensions 
   */
  constructor(position = {x: 0, y: 0}, canvasDimensions) {
    const vertex = plane(Pipe.DEFAULT_WIDTH, Pipe.DEFAULT_HEIGHT);
    const scale = {x: 1, y: 1};
    const rotation = 0;
    position = !position ? {x: 0, y: 0} : position;
    super(vertex, null, position, rotation, scale, null, null, canvasDimensions);
    this.collider = new BoxCollider(0, 0, Pipe.DEFAULT_WIDTH, Pipe.DEFAULT_HEIGHT);
  }
}


export default Pipe;