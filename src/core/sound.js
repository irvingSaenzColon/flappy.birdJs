

class SoundController {
  static SOUND_GENERAL_VOLUME = 1;
  static SOUND_FOLDER = './src/assets/sounds/';
  static SOUND_TYPE = {
    "JUMP": 1,
    "SCORE": 2,
    "HIT": 3
  };
  static SOUNDS = {
    1: new Audio(`${SoundController.SOUND_FOLDER}wing.wav`),
    2: new Audio(`${SoundController.SOUND_FOLDER}point.wav`),
    3: new Audio(`${SoundController.SOUND_FOLDER}hit.wav`),
  };


  /**
   * @param { String } soundType 
   */
  static play(soundType) {
    if(!this.SOUNDS[soundType] || !this.SOUNDS[soundType] instanceof Audio) {
      throw new Error('Sound does not exists');
    }
    this.SOUNDS[soundType].currentTime = 0;
    this.SOUNDS[soundType].play();
  }


  static createAudio(key, name) {
    if(this.SOUNDS[key]) {
      throw new Error('Sound already defined, use another key for that sound');
    }
    this.SOUNDS[key] = new Audio(`${this.SOUND_FOLDER + name}`);
  }
}


export default SoundController;