/** @import * as typedef from './typedef.js' */
import { plane } from "./figures.js";
import GameObject from "./gameObject.js";
import Input from "./Input.js";


class Player extends GameObject {
  keyBindings = {
    "Space": () => this.jump(),
  }


  /**
   * 
   * @param {typedef.Vec2} position 
   * @param {*} texture 
   * @param {typedef.Vec2} scale
   * @param {Number} rotation 
   * @param {typedef.Dimension} canvasDimensions 
   */
  constructor(texture, canvasDimensions) {
    const vertex = plane(45. , 45);
    const scale = { x: 1, y: 1};
    const translate = { x: 30, y: 450};
    const rotation = 0;
    super(vertex, texture, translate, rotation, scale, null, 0.98, canvasDimensions);
    Input.setup(this.keyBindings);
  }


  jump() {
    this.velocity.y = 12;
  }


  destroy() {
    Input.destroy();
    this.shader.destroy();
  }
}


export default Player;