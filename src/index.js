import WebGL from "./WebGL.js";
const canvas = document.getElementById('buffer');
let animationRequestId = null;
const PLAYER_CONTROLLER = {
  "SPACE": "Space",
}

const vertexShaderCode = `#version 300 es
precision mediump float; 
in vec2 v_position;
uniform vec2 resolution;
void main() {
  vec2 clipSpace = ((v_position / resolution) * 2.0) - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0); 
}`;
const fragmentShaderSourceCode = `#version 300 es
precision mediump float; 
out vec4 outputColor;
uniform vec4 u_color;
void main() {
  outputColor = u_color;
}`;


/**
 * runs the main logic for gl rendering
 */
function main() {
  WebGL.initialize(canvas);
  let triangleColor = [0.92, 0.2, 0.7, 1];
  const gravity = 0.98;
  let vy = 0;
  let vertexPosition = [
    50, 50,
    80, 50,
    50, 80,
    50, 80,
    80, 50,
    80, 80,
  ];

  //Creates a buffer to pass vertex positions
  const vertexBufferPosition = WebGL.context.createBuffer();
  if(vertexBufferPosition === null) {
    throw new Error('Error while creating buffer');
  }
  WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, vertexBufferPosition);

  const vertexShader = WebGL.createShader(WebGL.context.VERTEX_SHADER, vertexShaderCode);
  const fragmentShader = WebGL.createShader(WebGL.context.FRAGMENT_SHADER, fragmentShaderSourceCode);
  
  const shaderProgram = WebGL.createShaderProgram(vertexShader, fragmentShader);

  //Getting locations of some variables placed on shaders
  const vertexPositionAttrLocation = WebGL.getAttributeLocation(shaderProgram, 'v_position');
  const resolutionUniformLocation = WebGL.getUniformLocation(shaderProgram, 'resolution');
  const colorUniformLocation = WebGL.getUniformLocation(shaderProgram, 'u_color');


  function render() {
    //Output merger - how to merge the shaded pixel fragment with existing output image
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // Clears color buffer
    WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0);
    //Clears depth buffer
    WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);

    // Rasterization - which pixels are part of a triangle
    WebGL.context.viewport(0.0, 0.0, canvas.width, canvas.height);

    //Set gpu program (vertex shader + fragment shader)
    WebGL.context.useProgram(shaderProgram);
    WebGL.context.enableVertexAttribArray(vertexPositionAttrLocation);

    //Input assembler - how to read vertices from GPU triangle buffer
    WebGL.context.vertexAttribPointer(vertexPositionAttrLocation, 2, WebGL.context.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0, 0);
    WebGL.context.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    vy -= gravity;
    //TODO: Hacer que suba y baje
    if(vertexPosition[1] > 50) {
      jump();
    }

    WebGL.context.uniform4f(colorUniformLocation, ...triangleColor)
    WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, new Float32Array(vertexPosition), WebGL.context.DYNAMIC_DRAW);
    WebGL.context.drawArrays(WebGL.context.TRIANGLES, 0, 6);
    window.requestAnimationFrame(render);
  }
  
  function disposeData() {
    WebGL.context.deleteBuffer(vertexBufferPosition);
    WebGL.context.deleteShader(vertexShader);
    WebGL.context.deleteShader(fragmentShader);
    WebGL.context.deleteProgram(shaderProgram);
    window.cancelAnimationFrame(animationRequestId);
  }
  window.addEventListener('beforeunload', (e) => disposeData());
  animationRequestId = window.requestAnimationFrame(render);
  window.addEventListener('keydown', (e) => {
    if(e.code === PLAYER_CONTROLLER.SPACE) {
      console.log("Hola con espacio");
      vy = 12;
      jump();
    }
  });


  function jump() {
      vertexPosition[1] += vy;
      vertexPosition[3] += vy;
      vertexPosition[5] += vy;
      vertexPosition[7] += vy;
      vertexPosition[9] += vy;
      vertexPosition[11] += vy;
  }
}


try {
  main()
} catch(e) {
  console.error(e);
}