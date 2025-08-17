/** @import * as typedef from './Types.js' */
import WebGL from "./WebGL.js";


class ShaderHandler {
  static SHADER_LOCATION_TYPE = {
    "ATTRIBUTE": "attribute",
    "UNIFORM": "uniform"
  }

  /**
   * @param {Object} shaderParams
   */
  constructor(shaderParams = null) {
    this.texture = null;
    this.shaderParams = shaderParams;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.shaderProgram = null;
    this.vertexPositionAttrLocation = null;
    this.resolutionUniformLocation = null;
  }


  render(vertexShaderCode, fragmentShaderCode) {
    this.vertexBufferPosition = WebGL.context.createBuffer();
    if(this.vertexBufferPosition === null) {
      throw new Error('Error while creating buffer');
    }

    WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, this.vertexBufferPosition);

    this.vertexShader = WebGL.createShader(WebGL.context.VERTEX_SHADER, vertexShaderCode);
    this.fragmentShader = WebGL.createShader(WebGL.context.FRAGMENT_SHADER, fragmentShaderCode);
    this.shaderProgram = WebGL.createShaderProgram(this.vertexShader, this.fragmentShader);

    //Getting locations of some variables placed on shaders
    this.vertexPositionAttrLocation = WebGL.getAttributeLocation(this.shaderProgram, 'v_position');
    this.resolutionUniformLocation = WebGL.getUniformLocation(this.shaderProgram, 'resolution');
    this.colorUniformLocation = WebGL.getUniformLocation(this.shaderProgram, 'u_color');
    this.loadShaderParams();
  }


  loadShaderParams() {
    if(!this.shaderParams) {
      return;
    }
    for(const i in this.shaderParams) {
      if(this.shaderParams[i].type === ShaderHandler.SHADER_LOCATION_TYPE.UNIFORM) {
        this[this.shaderParams[i].name] = WebGL.getUniformLocation(this.shaderProgram, this.shaderParams[i].shaderVariableName);
      }
    }
  }


  /**
   * @param { Array<number> } vertexPosition
   * @param { typedef.Dimension } canvas 
   * @param { Array<number> } triangleColor 
   */
  update(vertexPosition, canvas, triangleColor) {
    WebGL.context.useProgram(this.shaderProgram);
    WebGL.context.enableVertexAttribArray(this.vertexPositionAttrLocation);
    WebGL.context.vertexAttribPointer(this.vertexPositionAttrLocation, 2, WebGL.context.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0, 0);
    //TODO: load dynamicly params to shader to make it more generic
    WebGL.context.uniform2f(this.resolutionUniformLocation, canvas.width, canvas.height);
    WebGL.context.uniform4f(this.colorUniformLocation, ...triangleColor);
    WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, new Float32Array(vertexPosition), WebGL.context.DYNAMIC_DRAW);
    WebGL.context.drawArrays(WebGL.context.TRIANGLES, 0, (vertexPosition.length / 2));
  }


  destroy() {
    WebGL.context.deleteBuffer(this.vertexBufferPosition);
    WebGL.context.deleteShader(this.vertexShader);
    WebGL.context.deleteShader(this.fragmentShader);
    WebGL.context.deleteProgram(this.rProgram);
  }
}

export default ShaderHandler;