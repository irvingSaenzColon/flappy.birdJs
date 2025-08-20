class SoundController {
  static SOUND_GENERAL_VOLUME = 1;
  static SOUND_FOLDER = '';
  static #SOUNDS = null;


  /**
   * @param { String } soundType 
   */
  static play(soundType) {
    if(!this.#SOUNDS) {
      throw new Error('There is no sound defined');
    }
    if(!this.#SOUNDS[soundType] || !this.#SOUNDS[soundType] instanceof Audio) {
      throw new Error('Sound does not exists');
    }
    this.#SOUNDS[soundType].currentTime = 0;
    this.#SOUNDS[soundType].play();
  }


  static createAudio(key, name) {
    if(!this.#SOUNDS) {
      this.#SOUNDS = {};
    }
    if(this.#SOUNDS[key]) {
      throw new Error('Sound already defined, use another key for that sound');
    }
    this.#SOUNDS[key] = new Audio(`${this.SOUND_FOLDER + name}`);
  }
}


export default SoundController;