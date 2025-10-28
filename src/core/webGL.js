class WebGL {
  /**@type {WebGL2RenderingContext | null} */
  static context = null;


  constructor() { }


  /**
   * Get the canvas context and initialize gl by default to webgl2
   * @param {HTMLCanvasElement} canvas 
   */
  static initialize(canvas) {
    try {
      this.context = canvas.getContext('webgl2');
      if (this.context === null) {
        throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.');
      }
    } catch (e) {
      console.error(e);
    }
  }


  /**
   * Creates a shader program and compiles it
   * @param {WebGLRenderingContextBase} type 
   * @param {string} sourceCode 
   * @returns {WebGLShader}
   */
  static createShader(type, sourceCode) {
    if (!sourceCode) {
      throw new Error('Missing shader source code');
    }
    if (!type) {
      throw new Error("Shader type must be provided");
    }
    const shader = this.context.createShader(type);
    if (!shader) {
      throw new Error('Could not allocate vertex shader');
    }
    this.context.shaderSource(shader, sourceCode);
    this.context.compileShader(shader);
    if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
      const compileError = this.context.getShaderInfoLog(shader);
      this.context.deleteShader(shader);
      throw new Error(`${type === this.context.VERTEX_SHADER ? 'Vertex' : 'Fragment'} shader compile error: ${compileError}`);
    }
    return shader;
  }


  /**
   * @param {WebGLShader} vertexShader
   * @param {WebGLShader} fragmentShader
   * @returns {WebGLProgram}
   */
  static createShaderProgram(vertexShader, fragmentShader) {
    const program = this.context.createProgram();
    this.context.attachShader(program, vertexShader);
    this.context.attachShader(program, fragmentShader);
    this.context.linkProgram(program);
    if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
      const linkError = this.context.getProgramInfoLog(program);
      this.context.deleteProgram(program);
      throw new Error(`Link program error: ${linkError}`);
    }
    return program;
  }


  /**
   * @param {WebGLProgram} shaderProgram 
   * @param {string} name 
   * @returns {GLint}
   */
  static getAttributeLocation(shaderProgram, name) {
    const attrLocation = this.context.getAttribLocation(shaderProgram, name);
    if (attrLocation < 0) {
      throw new Error(`Failed to get attribute location for ${name}`);
    }
    return attrLocation;
  }


  /**
   * @param {WebGLProgram} shaderProgram 
   * @param {string} name 
   * @returns {WebGLUniformLocation}
   */
  static getUniformLocation(shaderProgram, name) {
    const attrLocation = this.context.getUniformLocation(shaderProgram, name);
    if (attrLocation < 0) {
      throw new Error(`Failed to get attribute location`);
    }
    return attrLocation;
  }


  static getOrthogrpahicMatrix(left, right, bottom, top) {
    return new Float32Array([
      2 / (right - left), 0, 0,
      0, 2 / (top - bottom), 0,
      - (right + left) / (right - left),
      - (top + bottom) / (top - bottom),
      1
    ]);
  }
}

export default WebGL;
