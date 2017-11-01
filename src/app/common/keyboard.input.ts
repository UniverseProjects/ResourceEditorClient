export class KeyboardInput {
  private keyCallback: { [keyCode: number]: () => void; } = {};
  private keyDown: { [keyCode: number]: boolean; } = {};

  constructor() {
    document.addEventListener('keydown', (event) => {
      if (this.hasBinding(event.keyCode)) {
        this.keyDown[event.keyCode] = true;
        event.preventDefault();
      }
    });
    document.addEventListener('keyup', (event) => {
      if (this.hasBinding(event.keyCode)) {
        this.keyDown[event.keyCode] = false;
        event.preventDefault();
      }
    });
  }

  private hasBinding(keyCode: number): boolean {
    return this.keyCallback[keyCode] != null;
  }

  bindKeys(keyCodes: number[], callback: () => void) {
    keyCodes.forEach((keyCode) => this.bindKey(keyCode, callback));
  }

  bindKey(keyCode: number, callback: () => void) {
    this.keyCallback[keyCode] = callback;
    this.keyDown[keyCode] = false;
  };

  inputLoop() {
    for (let key in this.keyDown) {
      if (this.keyDown[key]) {
        let callback = this.keyCallback[key];
        if (callback != null) {
          callback();
        }
      }
    }
  }

}
