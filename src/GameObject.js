import ShaderHandler from './ShaderHandler.js';


class GameObject {

  /**
   * @param {Array<number>} vertex 
   * @param {Objec} shaderParams,
   * @param {Array} position
   * @param {number} gravity 
   */
  constructor(vertex, position, shaderParams, gravity) {
    this.vertex = vertex;
    this.position = position;
    this.roation = rotation;
    this.scale = scale;
    this.gravity = gravity;
    this.velocity = {x: 0, y: 0};
    this.shader = new ShaderHandler(shaderParams);
  }


  update() {
    if(this.gravity) {
      this.velocity.y -= this.gravity;
      this.vertex.forEach((v, i) => {
        if(i % 2 == 1) {
          v += this.velocity.y;
        }
      });
    }
    this.shader.update(this.vertex);
  }


  render() {
    this.shader.render();
  }


  dispose() {
    this.shader.dispose();
  }
}

export default GameObject;