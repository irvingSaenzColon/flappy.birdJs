/** @import * as typedef from './typedef.js' */
/** @import Texture from './texture.js' */
import WebGL from "./webGL.js";


class ShaderHandler {
  static SHADER_LOCATION_TYPE = {
    "ATTRIBUTE": "attribute",
    "UNIFORM": "uniform"
  }


  /**
   * @param { Object } shaderParams
   * @param { Texture | null } texture
   */
  constructor(shaderParams = null, texture = null) {
    this.texture = texture;
    this.shaderParams = shaderParams;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.shaderProgram = null;
    this.vertexPositionAttrLocation = null;
    this.resolutionUniformLocation = null;
    //Texture coordinates declaration
    this.textureCoordinatesBuffer = null;
    this.textureCoordinatesLocation = null;
    this.color = null;
    if(!this.texture) {
      this.color = [Math.random(), Math.random(), Math.random(), 1];
    }
  }


  /**
   * @param { String } vertexShaderCode 
   * @param { String } fragmentShaderCode 
   */
  #setup(vertexShaderCode, fragmentShaderCode) {
    //Create shader programs and compiles
    this.vertexShader = WebGL.createShader(WebGL.context.VERTEX_SHADER, vertexShaderCode);
    this.fragmentShader = WebGL.createShader(WebGL.context.FRAGMENT_SHADER, fragmentShaderCode);
    this.shaderProgram = WebGL.createShaderProgram(this.vertexShader, this.fragmentShader);

    //Getting locations of some variables placed on shaders
    this.vertexPositionAttrLocation = WebGL.getAttributeLocation(this.shaderProgram, 'v_position');
    this.textureCoordinatesAttrLocation = WebGL.getAttributeLocation(this.shaderProgram, 'a_texCoord');
  }


  /**
   * @param { Float32Array } vertexPosition 
   */
  #setupGeometryBuffer(vertexPosition) {
    this.vertexBufferPosition = WebGL.context.createBuffer();
    if(this.vertexBufferPosition === null) {
      throw new Error('Error while creating buffer');
    }
    WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, this.vertexBufferPosition);
    WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, vertexPosition, WebGL.context.STATIC_DRAW);
  }


  /**
   * @param { Float32Array } texCoord
   */
  #setupTextureBuffer(texCoord) {
    //Creating texture coordinates buffer
    this.textureCoordinatesBuffer = WebGL.context.createBuffer();
    if(this.textureCoordinatesBuffer === null) {
      throw new Error('Error while creating textCoordBuffer');
    }
    WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, this.textureCoordinatesBuffer);
    WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, texCoord, WebGL.context.STATIC_DRAW);
  }


  #setupLocations() {
    this.resolutionUniformLocation = WebGL.getUniformLocation(this.shaderProgram, 'resolution');
    this.worldMatrixUniformLocation = WebGL.getUniformLocation(this.shaderProgram, 'u_worldMatrix');
    this.samplerUniformLocation = WebGL.getUniformLocation(this.shaderProgram, "u_texture");
  }


  /**
   * @param { String } vertexShaderCode
   * @param { String } fragmentShaderCode
   * @param { Float32Array } vertexPosition
   * @param { Float32Array } texCoord
   */
  render(vertexShaderCode, fragmentShaderCode, vertexPosition, texCoord) {
    this.#setup(vertexShaderCode, fragmentShaderCode);
    //Setup geometry
    this.#setupGeometryBuffer(vertexPosition);
    if(this.texture) {
      this.texture.setupTexture();
      //Setup texture
      this.#setupTextureBuffer(texCoord);
    }
    //Setup locations
    this.#setupLocations();
  }


  /**
   * @param { Array<number> } vertexPosition
   * @param { Array<Number> } texCoord 
   * @param { typedef.Dimension } canvas
   * @param { Array<Number> } wordlMatrix
   */
  update(vertex, texCoord, canvas, wordlMatrix) {
    WebGL.context.useProgram(this.shaderProgram);
    //Vertext attribute location assign
    WebGL.context.enableVertexAttribArray(this.vertexPositionAttrLocation);
    WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, this.vertexBufferPosition);
    WebGL.context.vertexAttribPointer(this.vertexPositionAttrLocation, 2, WebGL.context.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    //Texture attribute location assign
    WebGL.context.enableVertexAttribArray(this.textureCoordinatesAttrLocation);
    WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, this.textureCoordinatesBuffer);
    WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, texCoord, WebGL.context.STATIC_DRAW);
    WebGL.context.vertexAttribPointer(this.textureCoordinatesAttrLocation, 2, WebGL.context.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    WebGL.context.uniform2f(this.resolutionUniformLocation, canvas.width, canvas.height);
    WebGL.context.uniformMatrix3fv(this.worldMatrixUniformLocation, false, wordlMatrix);
    if(this.texture) {
      this.texture.bind(0, this.samplerUniformLocation);
    }
    WebGL.context.drawArrays(WebGL.context.TRIANGLES, 0, (vertex.length / 2));
  }


  destroy() {
    WebGL.context.deleteBuffer(this.vertexBufferPosition);
    WebGL.context.deleteBuffer(this.textureCoordinatesBuffer);
    WebGL.context.deleteShader(this.vertexShader);
    WebGL.context.deleteShader(this.fragmentShader);
    WebGL.context.deleteProgram(this.shaderProgram);
  }
}


export default ShaderHandler;