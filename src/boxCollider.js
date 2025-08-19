/** @import * as typedef from './typedef.js' */
import Collider from './collider.js';
import Matrix from './matrix.js';


class BoxCollider extends Collider {
  static INDEX = {
    X_BOTTOM_LEFT: 0,
    Y_BOTTOM_LEFT: 1,
    X_BOTTOM_RIGHT: 2,
    Y_BOTTOM_RIGHT: 3,
    X_UPPER_LEFT: 4,
    Y_UPPER_LEFT: 5,
    X_UPPER_RIGHT: 6,
    Y_UPPER_RIGHT: 7,
    
  }
  /** @type { Array<Number> } */
  points = null;
  #localPoints = [];


  /**
   * @param { Number } xStart 
   * @param { Number } yStart 
   */
  constructor(xStart, yStart, xEnd, yEnd) {
    super();
    this.points = [
      xStart, yStart, //BOTTOM LEFT
      xEnd, yStart,   //BOTTOM RIGHT
      xStart, yEnd,   //UPPER LEFT
      xEnd, yEnd,     //UPPER RIGHT
    ];
    this.#localPoints = [...this.points];
  }


  /**
   * @param { typedef.Vec2 } position
   */
  update(position) {
    const limit = this.#localPoints.length - 2;
    for(let i = 0; i <= limit; i += 2) {
      this.points[i] = position.x + this.#localPoints[i];
      this.points[i + 1] = position.y + this.#localPoints[i + 1];
    }
  }


  /**
   * @param { BoxCollider } collider
   * @returns { Boolean }
   */
  isColliding(collider) {
    if(!collider) {
      throw new Error('A collider must be provided');
    } else if(!collider instanceof BoxCollider) {
      throw new Error('A collider must be of BoxCollider type')
    }
    if(collider instanceof BoxCollider) {
      return this.#isBoxColliding(collider);
    }
    return false;
  }


/*

*/
  /**
   * @param { BoxCollider } collider
   * @returns { Boolean }
   */
  #isBoxColliding(collider) {
    return this.points[BoxCollider.INDEX.X_BOTTOM_LEFT] <= collider.points[BoxCollider.INDEX.X_UPPER_RIGHT]
    && this.points[BoxCollider.INDEX.X_UPPER_RIGHT] >= collider.points[BoxCollider.INDEX.X_BOTTOM_LEFT]
    && this.points[BoxCollider.INDEX.Y_BOTTOM_LEFT] <= collider.points[BoxCollider.INDEX.Y_UPPER_RIGHT]
    && this.points[BoxCollider.INDEX.Y_UPPER_RIGHT] >= collider.points[BoxCollider.INDEX.Y_BOTTOM_LEFT];
  }
}


export default BoxCollider;