import fs from "fs";
function assert(something: boolean, msg: string) {
  if (!something) throw new Error("Assertion failed: " + msg);
}

type Instruction = [string, number];
function getInput(): string {
  return fs.readFileSync("08/input.txt").toString().trim();
}

function parseInput(input: string): Instruction[] {
  return input.split("\n").map((line) => {
    let tokens = line.split(" ");
    assert(tokens.length == 2, "Invalid instruction: " + line);
    return [tokens[0], parseInt(tokens[1], 0)];
  });
}

function solve1(instructions: Instruction[]): number {
  let visited = new Set();
  let i = 0;
  let acc = 0;
  let op, number;
  while (true) {
    if (visited.has(i)) {
      return acc;
    }
    visited.add(i);
    [op, number] = instructions[i];
    switch (op) {
      case "nop":
        i++;
        break;
      case "jmp":
        i += number;
        break;
      case "acc":
        acc += number;
        i++;
        break;
      default:
        assert(false, "Unknown operation: " + op);
    }
  }
}

function solve2(instructions: Instruction[]): number {
  let visited = new Set();
  let i = 0;
  let acc = 0;
  let count = 0;
  let op, number;
  let skipAfter = 0;
  let skipped = false;

  function reset() {
    visited = new Set();
    i = 0;
    acc = 0;
    count = 0;
    skipAfter++;
    skipped = false;
  }

  while (true) {
    if (visited.has(i)) reset();
    visited.add(i);
    count++;

    if (!instructions[i]) {
      return acc;
    }

    [op, number] = instructions[i];
    if (!skipped && count >= skipAfter) {
      if (op === "nop") {
        op = "jmp";
        skipped = true;
        console.log(`Skipped ${count} (${i}), next skip: ${skipAfter}`);
      } else if (op === "jmp") {
        op = "nop";
        skipped = true;
        skipAfter++;
        console.log(`Skipped ${count} (${i}), next skip: ${skipAfter}`);
      }
    }

    switch (op) {
      case "nop":
        i++;
        break;
      case "jmp":
        i += number;
        break;
      case "acc":
        acc += number;
        i++;
        break;
      default:
        assert(false, "Unknown operation: " + op);
    }
  }
}

console.log(
  `Test suite
-----------`
);
console.log(
  `Solve 1: ${solve1(
    parseInput(`nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`)
  )} == 5`
);

console.log(
  `Solve 2: ${solve1(
    parseInput(`nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`)
  )} == 8
--------`
);

console.log(`Problem 1: ${solve1(parseInput(getInput()))}`);
console.log(`Problem 2: ${solve2(parseInput(getInput()))}`);
