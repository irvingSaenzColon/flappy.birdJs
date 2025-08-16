import GameObject from "./GameObject.js";
import Input from "./Input.js";

export default class Player extends GameObject {
  keyBindings = {
    "Space": () => this.jump(),
  }


  constructor(position, scale, rotation, texture) {
    this.gravity = 0.98;
    const vertex = [
      50, 50,
      80, 50,
      50, 80,
      50, 80,
      80, 50,
      80, 80,
    ];
    super(vertex, position, {}, this.gravity);
    Input.setup(this.keyBindings);
  }


  jump() {
    this.velocity.y = 12;
  }


  dispose() {
    Input.dispose();
    this.shader.dispose();
  }
}