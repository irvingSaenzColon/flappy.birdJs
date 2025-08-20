/** @import * as typedef from './typedef.js' */


class Collider {


  constructor() {}


  /**
   * @param { Array<Number> } worldMatrix 
   */
  update(worldMatrix) {}


  /**
   * @param { typedef.Dimension } playerPosition
   * @returns { Boolean }
   */
  isColliding(playerPosition) {}
}


export default Collider;