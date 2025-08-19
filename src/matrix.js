/** @import * as typedef from './typedef.js' */


class Matrix {
  static EPSILON = 1e-10;


  /**
   * @param { Array<Number> } a
   * @param { Array<Number> } b
   */
  static multiply3x3Matrix(a, b) {
    if(a.length !== 9 || b.length !== 9) {
      throw new Error('Must provide an array of 9 elements');
    }
    return [
      ( (a[0] * b[0]) + (a[1] * b[3]) + (a[2] * b[6]) ), ( (a[0] * b[1]) + (a[1] * b[4]) + (a[2] * b[7]) ), ( (a[0] * b[2]) + (a[1] * b[5]) + (a[2] * b[8]) ),
      ( (a[3] * b[0]) + (a[4] * b[3]) + (a[5] * b[6]) ), ( (a[3] * b[1]) + (a[4] * b[4]) + (a[5] * b[7]) ), ( (a[3] * b[2]) + (a[4] * b[5]) + (a[5] * b[8]) ),
      ( (a[6] * b[0]) + (a[7] * b[3]) + (a[8] * b[6]) ), ( (a[6] * b[1]) + (a[7] * b[4]) + (a[8] * b[7]) ), ( (a[6] * b[2]) + (a[7] * b[5]) + (a[8] * b[8]) ),
    ];
  }


  /**
   * @param { Array<Number> } matrix
   * @param { Array<Number> } vector
   */
  static multiply3x3MatrixByVector(matrix, vector) {
    return [
      ( (matrix[0] * vector[0]) + (matrix[1] * vector[1]) + (matrix[2] * vector[2]) ),
      ( (matrix[3] * vector[0]) + (matrix[4] * vector[1]) + (matrix[5] * vector[2]) ),
      ( (matrix[6] * vector[0]) + (matrix[7] * vector[1]) + (matrix[8] * vector[2]) )
    ]
  }


  static identity() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ];
  }


  /**
   * @param { typedef.Vec2 } scale 
   */
  static scaleMatrix(scale) {
    return [
      scale.x, 0, 0,
      0, scale.y, 0,
      0, 0, 1
    ];
  }


  /**
   * @param { typedef.Vec2 } trasnlate 
   */
  static traslateMatrix(trasnlate) {
    return [
      1, 0, 0,
      0, 1, 0,
      trasnlate.x, trasnlate.y, 1
    ];
  }

  /**
   * 
   * @param { Number } rotation 
   */
  static rotationMatrix(rotation) {
    const rads = this.degreeToRad(rotation);
    let cos = Math.cos(rads);
    let sin = Math.sin(rads);
    cos = cos < this.EPSILON ? 0 : cos;
    sin = sin < this.EPSILON ? 0 : sin;
    return [
      cos, - sin, 0,
      sin, cos, 0,
      0, 0, 1
    ];
  }


  static degreeToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }
}


export default Matrix;