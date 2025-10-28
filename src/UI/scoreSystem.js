import CONFIG from "../config.js";
import Score from "../objects/score.js";


class ScoreSystem {
  static PADDING = {
    TOP: 20,
    HORIZONTAL: 10,
  };
  static #numberTexCoord = {
    "0": new Float32Array([
      0.00, 0.99,
      0.098, 0.99,
      0.00, 0.0,
      0.00, 0.0,
      0.098, 0.99,
      0.098, 0.0,
    ]),
    "1": new Float32Array([
      0.105, 0.99,
      0.17, 0.99,
      0.105, 0.0,
      0.105, 0.0,
      0.17, 0.99,
      0.17, 0.0,
    ]),
    "2": new Float32Array([
      0.172, 0.99,
      0.27, 0.99,
      0.172, 0.0,
      0.172, 0.0,
      0.27, 0.99,
      0.27, 0.0,
    ]),
    "3": new Float32Array([
      0.275, 0.99,
      0.375, 0.99,
      0.275, 0.0,
      0.275, 0.0,
      0.375, 0.99,
      0.375, 0.0,
    ]),
    "4": new Float32Array([
      0.38, 0.99,
      0.475, 0.99,
      0.38, 0.0,
      0.38, 0.0,
      0.475, 0.99,
      0.475, 0.0,
    ]),
    "5": new Float32Array([
      0.485, 0.99,
      0.579, 0.99,
      0.485, 0.0,
      0.485, 0.0,
      0.579, 0.99,
      0.579, 0.0,
    ]),
    "6": new Float32Array([
      0.585, 0.99,
      0.685, 0.99,
      0.585, 0.0,
      0.585, 0.0,
      0.685, 0.99,
      0.685, 0.0,
    ]),
    "7": new Float32Array([
      0.69, 0.99,
      0.785, 0.99,
      0.69, 0.0,
      0.69, 0.0,
      0.785, 0.99,
      0.785, 0.0,
    ]),
    "8": new Float32Array([
      0.795, 0.99,
      0.89, 0.99,
      0.795, 0.0,
      0.795, 0.0,
      0.89, 0.99,
      0.89, 0.0,
    ]),
    "9": new Float32Array([
      0.895, 0.99,
      1.00, 0.99,
      0.895, 0.0,
      0.895, 0.0,
      1.00, 0.99,
      1.00, 0.0,
    ]),
  }
  static #counter = 0;


  constructor(canvasDimensions) {
    const numbersTexture = `${CONFIG.TEXTURES_PATH}/numbers/numbers.png`;
    const transform = {
      translate: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
      rotation: 0,
    }
    this.scores = [
      new Score(transform, numbersTexture),
      new Score(transform, numbersTexture),
      new Score(transform, numbersTexture),
    ];
    const width = canvasDimensions.width;
    const height = canvasDimensions.height;
    this.center = {
      x: (width / 2) - (Score.getDimensions().width / 2),
      y: height - (Score.getDimensions().height + ScoreSystem.PADDING.TOP)
    }
    this.scores.forEach(s => {
      s.mesh.transform.translate = { x: this.center.x, y: this.center.y };
      s.mesh.textureCoordinates = ScoreSystem.#numberTexCoord[0]
    });
  }


  /*
   * @param { HTMLImageElement } img
   * */
  async onLoadResources(img) {
    if (!img) {
      throw new Error('Error: Image must be provided for scoreSystem');
    }
    this.scores.forEach(s => {
      s.texture.image = img
      s.shader.texture.image = img;
    });
  }


  /**
   * @param { String } vertexShaderCode 
   * @param { String } fragmentShaderCode 
   */
  async render(vertexShaderCode, fragmentShaderCode) {
    for (let i = 0; i < this.scores.length; i++) {
      this.scores[i].render(vertexShaderCode, fragmentShaderCode)
    }
  }


  update(projectionMatrix) {
    const counterSplit = ScoreSystem.#counter.toString().split('');
    for (let i = 0; i < counterSplit.length; i++) {
      this.scores[i].mesh.transform.translate.x = this.center.x + (Score.getDimensions().width * i);
      this.scores[i].mesh.textureCoordinates = ScoreSystem.#numberTexCoord[counterSplit[i]];
      this.scores[i].update(projectionMatrix);
    }
  }


  static increaseCounter() {
    this.#counter++;
  }


  static getCounter() {
    return this.#counter;
  }

  static reseyCounter() {
    this.#counter = 0;
  }
}


export default ScoreSystem;
