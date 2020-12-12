#!/usr/bin/env npm run ts-node

import fs from "fs";

type Board = string[][];
type SeatSurrounding = { empty: number, occupied: number };
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

function boardToString(board: Board): string {
  return board.map(line => line.join("")).join("\n");
}

function boardEq(a: Board, b: Board): boolean {
  return boardToString(a) === boardToString(b);
}

function getInput(): string {
  return fs.readFileSync("11/input.txt").toString().trim();
}

function parseInput(input: string): string[][] {
  return input.split("\n").map(l => l.split(""));
}

function visible(board: Board, row: number, col: number): SeatSurrounding {
  let empty = 0;
  let occupied = 0;

  DIRECTIONS.forEach(([i, j]) => {
    let nextRow = row;
    let nextCol = col;
    let val;
    while(true) {
      nextRow += i;
      nextCol += j;

      val = board[nextRow] && board[nextRow][nextCol];
      if(val === ".") continue;
      if(val === "L") empty++;
      if(val === "#") occupied++;

      return;
    }
  });

  return { empty: empty, occupied: occupied };
}

function adjacent(board: Board, row: number, col: number): SeatSurrounding {
  let empty = 0;
  let occupied = 0;

  DIRECTIONS.forEach(([i, j]) => {
    let val = board[row + i] && board[row + i][col + j];

    if (!val || val === "L" || val === ".") empty++;
    else if (val === "#") occupied++;
  });

  return { empty: empty, occupied: occupied };
}

function solve(
  board: Board,
  occupiedTreshold: number,
  surrounding: (board: Board, row: number, col: number) => SeatSurrounding
): number {
  let tick = (board: Board): Board => {
    return board.map((row, i) => {
      return row.map((seat, j) => {
        if (seat === ".") return seat;

        let status = surrounding(board, i, j);
        if (seat === "L") {
          return status.occupied === 0 ? "#" : "L";
        }
        else if (seat === "#") {
          return status.occupied >= occupiedTreshold ? "L" : "#";
        }
        else {
          throw new Error(`Unknown seat: ${seat}`);
        }
      });
    });
  }

  let newBoard: Board;
  while (!boardEq(board, newBoard = tick(board))) {
    board = newBoard;
  }

  return board.flat().filter(s => s === "#").length;
}

function solve1(board: Board): number {
  return solve(board, 4, adjacent);
}

function solve2(board: Board): number {
  return solve(board, 5, visible);
}

const testInput =
  `#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##`;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 37`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

console.log(`Test 2: ${solve2(parseInput(testInput))} =?= 26`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
