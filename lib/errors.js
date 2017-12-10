class LexicalError extends Error {
  constructor(message, line) {
    super();
    errorObjInitializer.call(this, "LexicalError", message, line);
  }
}


class EndOfFile extends Error {
  constructor(message, line) {
    super();
    errorObjInitializer.call(this, "EndOfFile", message, line);
  }
}



function errorObjInitializer(name, message, line) {
  if (message instanceof Error)
    this.message = message.message;
  else
    this.message = message;
  this.name = name;
  this.line = line;
}


module.exports = {
  LexicalError,
  EndOfFile,
};
