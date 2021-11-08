const stream = require("stream");

var Transform = stream.Transform;

class transformStream1 extends Transform {
  constructor(foo, action) {
    super();
    this.transformFoo = foo;
    this.action = action;
  }
  _transform(chunk, enc, done) {
    const encodedChunk = this.transformFoo(
      chunk.toString("utf8"),
      this.action ? 1 : -1
    );
    this.push(encodedChunk);
    done();
  }
}

class transformStream8 extends Transform {
  constructor(foo, action) {
    super();
    this.transformFoo = foo;
    this.action = action;
  }
  _transform(chunk, enc, done) {
    const encodedChunk = this.transformFoo(
      chunk.toString("utf8"),
      this.action ? 8 : -8
    );
    this.push(encodedChunk);
    done();
  }
}

class transformStreamAtbash extends Transform {
  constructor(foo) {
    super();
    this.transformFoo = foo;
  }
  _transform(chunk, enc, done) {
    const encodedChunk = this.transformFoo(chunk.toString("utf8"));
    this.push(encodedChunk);
    done();
  }
}

module.exports = {
    transformStream1  : transformStream1 ,
    transformStream8 : transformStream8,
    transformStreamAtbash:transformStreamAtbash
  }