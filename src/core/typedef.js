const shaderParams = [
  {
    "shaderVariableName": "v_position",
    "type": "attribute",
    "name": "vertexPositionAttrLocation",
    "subType": "",
    "value": "",
    "dataType": "",
    "stride": "",
  }
];
/**
 * @typedef Vec2
 * @property { Number } x
 * @property { Number } y
 */
/**
 * @typedef Dimension
 * @property { Number } width
 * @property { Number } height
 */
/**
 * @typedef Point
 * @property { Number } x
 * @property { Number } y
 */
/**
 * @typedef BoxPoint
 * @property { Point } BottomLeft
 * @property { Point } BottomRight
 * @property { Point } UpperLeft
 * @property { Point } UpperRight
 */
/**
 * @enum
 */
const SOUND_TYPE = {
  "JUMP": 1,
  "SCORE": 2,
  "HIT": 3
}


export default { SOUND_TYPE };