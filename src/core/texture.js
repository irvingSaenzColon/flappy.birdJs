import WebGL from "./webGL.js";


class Texture {
  

  /**
   * @param { String } path 
   * @param { Float32Array } texCoords
   */
  constructor(path, texCoords) {
    if(!path) {
      throw new Error('A file must be provided with path');
    }
    this.glTexture = WebGL.context.createTexture();
    this.textureCoordinates = texCoords;
    WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, this.glTexture);
    WebGL.context.texImage2D(WebGL.context.TEXTURE_2D, 0, WebGL.context.RGBA, 1, 1, 0, WebGL.context.RGBA, WebGL.context.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
    if(path) {
      this.image = new Image();
      this.image.src = path;
      this.image.addEventListener('load', (e) => {
        WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, this.glTexture);
        WebGL.context.texImage2D(WebGL.context.TEXTURE_2D, 0, WebGL.context.RGBA, WebGL.context.RGBA, WebGL.context.UNSIGNED_BYTE, this.image);
        WebGL.context.generateMipmap(WebGL.context.TEXTURE_2D);
      });
    }
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