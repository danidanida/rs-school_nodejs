const fs = require("fs");
const caesarShift = require("./ciphers/caesar_cipher");
const atbashShift = require("./ciphers/atbash_cipher");
const { validateAndParseArgs, throwErrorAndExit } = require("./utils");
const {
  transformStream1,
  transformStream8,
  transformStreamAtbash,
} = require("./transform");

(function main() {
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
        throwErrorAndExit("Human-friendly error");
    }
  }
  readableStream.pipe(writableStream);
})();
