import fs from "fs";

class Board {
  input: string[][];

  constructor(input: string[][]) {
    this.input = input;
  }

  trees(down: number, right: number): number {
    let row = 0,
      col = 0,
      treeCount = 0;
    let current;
    while ((current = this.at(row, col))) {
      if (current == "#") treeCount++;
      row += down;
      col += right;
    }

    return treeCount;
  }

  private at(rowi: number, coli: number): string | null {
    let row = this.input[rowi];
    if (!row) return null;
    return row[coli % row.length];
  }
}

function getInput(): Board {
  let input: string[][] = fs
    .readFileSync("03/input.txt")
    .toString()
    .trim()
    .split("\n")
    .map((s) => s.split(""));

  return new Board(input);
}

const board = getInput();

console.log("Problem 1 -- down 3, right 1:");
console.log(`Tree count: ${board.trees(1, 3)}`);

console.log(`-----`);

let result2 = [
  [1, 1],
  [1, 3],
  [1, 5],
  [1, 7],
  [2, 1],
].reduce((acc, [down, right]) => acc * board.trees(down, right), 1);
console.log("Problem 2 -- multiple paths");
console.log(`Tree count: ${result2}`);
