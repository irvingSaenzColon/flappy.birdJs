/** @import * as typedef from './typedef.js' */
import BoxCollider from "./boxCollider.js";
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
    const width = 45;
    const height = 45;
    const vertex = plane(width, height);
    const scale = { x: 1, y: 1};
    const translate = { x: 30, y: 450};
    const rotation = 0;
    super(vertex, texture, translate, rotation, scale, null, 0.12, canvasDimensions);
    this.collider = new BoxCollider(0, 0, width, height);
    Input.setup(this.keyBindings);
  }


  restart() {
    this.position.x = 30;
    this.position.y = 450;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }


  jump() {
    this.velocity.y = 1.8;
  }


  destroy() {
    Input.destroy();
    this.shader.destroy();
  }
}


export default Player;