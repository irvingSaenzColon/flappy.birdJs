class Input {
  static keyBindings = null;

  static setup(keyBindings) {
    this.keyBindings = keyBindings;
    window.addEventListener('keydown', this.handle);
  }


  /**
   * 
   * @param {KeyboardEvent} e 
   */
  static handle(e) {
    this.keyBindings[e.code]();
  }


  static dispose() {
    window.removeEventListener('keydown', this.handle);
  }
}


export default Input;