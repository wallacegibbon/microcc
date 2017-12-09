class ReaderError extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "ReaderError", message);
  }
}


class EndOfFile extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "EndOfFile", message);
  }
}



function errorObjInitializer(name, message) {
  this.name = name;
  if (message instanceof Error)
    this.message = message.message;
  else
    this.message = message;
}


module.exports = {
  ReaderError,
  EndOfFile,
};
