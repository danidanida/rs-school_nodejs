const fs = require("fs");

module.exports = validateAndParseArgs = (argsArr) => {
  const arrayWithValidatedSpelling = validateDifferentSpelling(argsArr);

  let cIndex = arrayWithValidatedSpelling.indexOf("-c");
  let oIndex = arrayWithValidatedSpelling.indexOf("-o");
  let iIndex = arrayWithValidatedSpelling.indexOf("-i");

  let input = arrayWithValidatedSpelling[iIndex >= 0 ? iIndex + 1 : null];

  let output = arrayWithValidatedSpelling[oIndex >= 0 ? oIndex + 1 : null];

  let ciphers = arrayWithValidatedSpelling[cIndex + 1].split("-");

  if (iIndex !== -1 && !fs.existsSync(input)) {
    process.stderr.write("Human-friendly error! Wrong input. ");
    process.exit(1);
  }
  if (oIndex !== -1 && !fs.existsSync(output)) {
    process.stderr.write("Human-friendly error! Wrong output. ");
    process.exit(1);
  }

  if (!arrayWithValidatedSpelling.includes("-c")) {
    process.stderr.write(
      "Human-friendly error! Doesn't have configs argument. "
    );
    process.exit(1);
  }

  if (!validateCiphersNames(ciphers)) {
    process.stderr.write("Human-friendly error! Error in configs arguments. ");
    process.exit(1);
  }
  if (!validateArgsAreNotDuplicated(arrayWithValidatedSpelling)) {
    process.stderr.write("Human-friendly error! Duplicated values. ");
    process.exit(1);
  }

  return { input, output, ciphers };
};

function validateDifferentSpelling(argsArr) {
  // REFACTOR to forEach to reduce amount of code
  let arrayCopy = argsArr.slice();

  for (let i = 0; i < arrayCopy.length; i++) {
    let curr = arrayCopy[i];
    if (curr === "--config") {
      arrayCopy.splice(i, 1, "-c");
    }
    if (curr === "--input") {
      arrayCopy.splice(i, 1, "-i");
    }
    if (curr === "--output") {
      arrayCopy.splice(i, 1, "-o");
    }
  }
  return arrayCopy;
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
