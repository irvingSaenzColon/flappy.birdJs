import ResourceLoader from "./resourceLoader.js";
import WebGL from "./webGL.js";


class Texture {
  #path = "";
  

  /**
   * @param { String } path 
   */
  constructor(path) {
    if(!path) {
      throw new Error('A file must be provided with path');
    }
    this.#path = path;
  }


  async loadTexture() {
    if(!this.#path) {
      throw new Error("Error: Missing path of texture");
    }
    this.image = await ResourceLoader.getResource(this.#path);
  }


  async setupTexture() {
    if(!this.image) {
      throw new Error("Error: Image is not definied");
    }
    this.glTexture = WebGL.context.createTexture();
    WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, this.glTexture);
    WebGL.context.texImage2D(WebGL.context.TEXTURE_2D, 0, WebGL.context.RGBA, 1, 1, 0, WebGL.context.RGBA, WebGL.context.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, this.glTexture);
    WebGL.context.texImage2D(WebGL.context.TEXTURE_2D, 0, WebGL.context.RGBA, WebGL.context.RGBA, WebGL.context.UNSIGNED_BYTE, this.image);
    WebGL.context.generateMipmap(WebGL.context.TEXTURE_2D);
  }


  /**
   * @param { Number } unit 
   * @param { WebGLUniformLocation } samplerLocation 
   */
  bind(unit, samplerLocation) {
    WebGL.context.activeTexture(WebGL.context.TEXTURE0);
    WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, this.glTexture);
    WebGL.context.uniform1i(samplerLocation, unit)
  }
}


export default Texture;