class Token {
  constructor(name, value, line) {
    Object.assign(this, { name, value, line });
  }
}


module.exports = Token;

