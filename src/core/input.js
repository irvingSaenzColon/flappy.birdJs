class Input {
  static keyBindings = null;


  static setup(keyBindings) {
    this.keyBindings = keyBindings;
    window.addEventListener('keydown', (e) => this.handle(e));
  }


  /**
   * @param {KeyboardEvent} e 
   */
  static handle(e) {
    if(!this.keyBindings[e.code]) {
      return;
    }
    this.keyBindings[e.code]();
  }


  static destroy() {
    window.removeEventListener('keydown', this.handle);
  }
}


export default Input;
