const fs = require("fs");

function validateAndParseArgs(argsArr) {
  const arrayWithValidatedSpelling = validateDifferentSpelling(argsArr);

  let configIndex = arrayWithValidatedSpelling.indexOf("-c");
  let outputIndex = arrayWithValidatedSpelling.indexOf("-o");
  let inputIndex = arrayWithValidatedSpelling.indexOf("-i");

  // parsing
  let input =
    arrayWithValidatedSpelling[inputIndex >= 0 ? inputIndex + 1 : null];

  let output =
    arrayWithValidatedSpelling[outputIndex >= 0 ? outputIndex + 1 : null];

  let ciphers = arrayWithValidatedSpelling[configIndex + 1].split("-");

  // validation
  if (inputIndex !== -1 && !fs.existsSync(input)) {
    throwErrorAndExit("Human-friendly error! Wrong input. ");
  }
  if (outputIndex !== -1 && !fs.existsSync(output)) {
    throwErrorAndExit("Human-friendly error! Wrong output. ");
  }

  if ((configIndex = -1)) {
    throwErrorAndExit("Human-friendly error! Doesn't have configs argument. ");
  }

  if (!validateCiphersNames(ciphers)) {
    throwErrorAndExit("Human-friendly error! Error in configs arguments. ");
  }
  if (!validateArgsAreNotDuplicated(arrayWithValidatedSpelling)) {
    throwErrorAndExit("Human-friendly error! Duplicated values. ");
  }

  return { input, output, ciphers };
}

function validateDifferentSpelling(argsArr) {
  return argsArr.map((curr) => {
    if (curr === "--config") return "-c";
    if (curr === "--input") return "-i";
    if (curr === "--output") return "-o";
    return curr;
  });
}

function validateCiphersNames(ciphersArr) {
  for (let i = 0; i < ciphersArr.length; i++) {
    let curr = ciphersArr[i];
    if (
      curr !== "C0" &&
      curr !== "C1" &&
      curr !== "R1" &&
      curr !== "R0" &&
      curr !== "A"
    ) {
      return false;
    }
  }
  return true;
}

function validateArgsAreNotDuplicated(argsArr) {
  return new Set(argsArr).size == argsArr.length;
}

function throwErrorAndExit(str) {
  process.stderr.write(str);
  process.exit(1);
}

module.exports = {
  validateAndParseArgs: validateAndParseArgs,
  throwErrorAndExit: throwErrorAndExit,
};
