class Reader {
  constructor(code) {
    Object.assign(this, { code, cursor: 0, ch: null, prevCh: null, line: 1 });
  }


  checkEnd() {
    return this.cursor <= this.code.length;
  }


  getChar() {
  }


  getSym() {
  }
}
