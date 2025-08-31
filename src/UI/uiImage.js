/** @import * as typedef from '../core/typedef.js' */
import Game from "../core/game.js";
import GameObject from "../core/gameObject.js";
import Plane from "../core/plane.js";
import Texture from "../core/texture.js";


class UIImage extends GameObject {


  /**
   * @param { typedef.Vec2 } transform
   * @param { typedef.Dimension } uiDimensions 
   * @param { String } texture
   */
  constructor(transform, uiDimensions, texture) {
    super(texture, null, null, Game.CANVAS_DIMENSIONS, false);
    this.mesh = new Plane(uiDimensions.width, uiDimensions.height, transform);
    this.texture = new Texture(texture, this.mesh.textureCoordinates);
  }
}


export default UIImage;