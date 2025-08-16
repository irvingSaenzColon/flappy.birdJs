import { plane } from "./figures.js";
import GameObject from "./gameObject.js";
import Input from "./Input.js";


class Player extends GameObject {
  keyBindings = {
    "Space": () => this.jump(),
  }


  constructor(position, scale, rotation, texture, canvasDimensions) {
    const vertex = plane(45. , 45);
    super(vertex, position, rotation, scale, null, 0.98, canvasDimensions);
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