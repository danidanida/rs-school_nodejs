const fs = require("fs");
const stream = require("stream");
const caesarShift = require("./ciphers/caesar_cipher");
const atbashShift = require("./ciphers/atbash_cipher");
const validateAndParseArgs = require("./utils");

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

function main() {
  const parsedArgs = validateAndParseArgs(process.argv);
  const input = parsedArgs.input;
  const output = parsedArgs.output;

  let writableStream;
  let readableStream;

  if (input !== undefined) {
    readableStream = fs.createReadStream(input, { encoding: "utf8" });
    if (output !== undefined) {
      writableStream = fs.createWriteStream(output);
    }
  }
  if (input === undefined) {
    readableStream = process.stdin;
  }
  if (output === undefined) {
    writableStream = process.stdout;
  }

  for (let i = 0; i < parsedArgs.ciphers.length; i++) {
    switch (parsedArgs.ciphers[i]) {
      case "C1":
        readableStream = readableStream.pipe(
          new transformStream1(caesarShift, true)
        );
        break;
      case "C0":
        readableStream = readableStream.pipe(
          new transformStream1(caesarShift, false)
        );
        break;
      case "R1":
        readableStream = readableStream.pipe(
          new transformStream8(caesarShift, true)
        );
        break;
      case "R0":
        readableStream = readableStream.pipe(
          new transformStream8(caesarShift, false)
        );
        break;
      case "A":
        readableStream = readableStream.pipe(
          new transformStreamAtbash(atbashShift)
        );
        break;
      default:
        console.log("Human-friendly error");
    }
  }
  readableStream.pipe(writableStream);
}

main();
