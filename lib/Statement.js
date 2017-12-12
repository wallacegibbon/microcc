class Statement {}

class ContinueStatement extends Statement {}
class BreakStatement extends Statement {}
class ReturnStatement extends Statement {}



class WhileStatement extends Statement {
  constructor(condition, clause, line) {
    Object.assign(this, { condition, clause, line });
  }
}


class DoStatement extends Statement {
  constructor(condition, clause, line) {
    Object.assign(this, { condition, clause, line });
  }
}


class ForStatement extends Statement {
  constructor(s1, s2, s3, clause, line) {
    Object.assign(this, { s1, s2, s3, clause, line });
  }
}


class SwitchStatement extends Statement {
  constructor(condition, clauses, line) {
    Object.assign(this, { condition, clauses, line });
  }
}


class IfStatement extends Statement {
  constructor(condition, ifClause, elseClause) {
    Object.assign(this, { condition, ifClause, elseClause });
  }
}



module.exports = {
  ContinueStatement,
  BreakStatement,
  ReturnStatement,
  WhileStatement,
  DoStatement,
  ForStatement,
  SwitchStatement,
  IfStatement,
};

