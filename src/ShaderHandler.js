import WebGL from "./WebGL";


class ShaderHandler {
  static SHADER_LOCATION_TYPE = {
    "ATTRIBUTE": "attribute",
    "UNIFORM": "uniform"
  }

  /**
   * 
   * @param {Object} shaderParams 
   */
  constructor(shaderParams) {
    this.texture = null;
    this.shaderParams = shaderParams;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.shaderProgram = null;
    this.vertexPositionAttrLocation = null;
    this.resolutionUniformLocation = null;
  }


  render() {
    this.vertexBufferPosition = WebGL.context.createBuffer();
    if(this.vertexBufferPosition === null) {
      throw new Error('Error while creating buffer');
    }

    this.gl.bindBuffer(WebGL.context.ARRAY_BUFFER, this.vertexBufferPosition);

    this.vertexShader = WebGL.createShader(WebGL.context.VERTEX_SHADER, vertexShaderCode);
    this.fragmentShader = WebGL.createShader(WebGL.context.FRAGMENT_SHADER, fragmentShaderSourceCode);
    this.shaderProgram = WebGL.createShaderProgram(vertexShader, fragmentShader);

    //Getting locations of some variables placed on shaders
    this.vertexPositionAttrLocation = WebGL.getAttributeLocation(this.shaderProgram, 'v_position');
    //TODO: Think how to pass these variables because are not generic (use shaderParams)
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
   * @param {Array<number>} vertexPosition 
   */
  update(vertexPosition) {
    WebGL.context.useProgram(this.shaderProgram);
    WebGL.context.enableVertexAttribArray(this.vertexPositionAttrLocation);

    //Input assembler - how to read vertices from GPU triangle buffer
    WebGL.context.vertexAttribPointer(this.vertexPositionAttrLocation, 2, WebGL.context.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0, 0);
    for(const i in this.shaderParams) {
      WebGL.context[this.shaderParams[i].subType](this.shaderParams[i].name, ...this.shaderParams[i].value);
    }
    WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, new Float32Array(vertexPosition), WebGL.context.STATIC_DRAW);
    WebGL.context.drawArrays(WebGL.context.TRIANGLES, 0, vertexPosition.length);
  }


  dispose() {
    WebGL.context.deleteBuffer(this.vertexBufferPosition);
    WebGL.context.deleteShader(this.vertexShader);
    WebGL.context.deleteShader(this.fragmentShader);
    WebGL.context.deleteProgram(this.rProgram);
  }
}

export default ShaderHandler;