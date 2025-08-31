/** @import * as typedef from '../core/typedef.js' */
import UIImage from "../UI/uiImage.js";


class Score extends UIImage {
  static #dimesions = {
    width: 27,
    height: 43,
  }

  /**
   * @param { typedef.Transform } transform
   * @param { String } texture
   */
  constructor(transform, texture) {
    super(transform, Score.#dimesions, texture);
  }


  static getDimensions() {
    return this.#dimesions;
  }
}


export default Score;