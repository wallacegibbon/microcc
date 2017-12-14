class CLexicalError extends Error {
  constructor(message, line) {
    super();
    errorObjInitializer.call(this, "CLexicalError", message, line);
  }
}


class CSyntaxError extends Error {
  constructor(message, line) {
    super();
    errorObjInitializer.call(this, "CSyntaxError", message, line);
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
  CLexicalError,
  CSyntaxError,
  EndOfFile,
};
