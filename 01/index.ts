import fs from "fs";

function getInput(): number[] {
  return fs
    .readFileSync("01/input.txt")
    .toString()
    .split("\n")
    .map((s) => parseInt(s));
}

function find2NumbersAddingToX(numbers: number[], x: number): number[] | null {
  for (let n1 of numbers) {
    for (let n2 of numbers) {
      if (n1 + n2 == x) {
        return [n1, n2];
      }
    }
  }
  return null;
}

function find3NumbersAddingToX(numbers: number[], x: number): number[] | null {
  // Uck! But hey that'll work.
  for (let n1 of numbers) {
    for (let n2 of numbers) {
      for (let n3 of numbers) {
        if (n1 + n2 + n3 == x) {
          return [n1, n2, n3];
        }
      }
    }
  }
  return null;
}

function process(solved: number[] | null) {
  if (!solved) {
    console.error("Can't find a number, sorry!");
    return;
  }
  console.log(`Found: ${solved.join(", ")}`);
  console.log(
    `${solved.join(" * ")} -> ${solved.reduce((acc, x) => acc * x, 1)}`
  );
}

console.log("Finding 2 numbers:");
process(find2NumbersAddingToX(getInput(), 2020));

console.log("\n\n--------\n\n");

console.log("Finding 3 numbers:");
process(find3NumbersAddingToX(getInput(), 2020));
