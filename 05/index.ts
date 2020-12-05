import fs from "fs";

function bin(bits: number[]): number {
  return bits.reduce(
    (acc, value, index) => acc + value * Math.pow(2, bits.length - 1 - index),
    0
  );
}

function seatNumber(str: string): number {
  const bits = str
    .replace(/B/gi, "1")
    .replace(/F/gi, "0")
    .replace(/R/gi, "1")
    .replace(/L/gi, "0")
    .split("")
    .map((s) => parseInt(s, 10));

  const row = bin(bits.slice(0, 7));
  const col = bin(bits.slice(7, 10));
  return row * 8 + col;
}

function findMissingSeat(sortedSeats: number[]): number {
  for (let i = 1; i < sortedSeats.length - 1; i++) {
    let seat = sortedSeats[i];
    let nextSeat = sortedSeats[i + 1];

    if (seat + 1 !== nextSeat) {
      return seat + 1;
    }
  }
  throw new Error("Missing seat not found!");
}

function getInput(): string[] {
  return fs.readFileSync("05/input.txt").toString().trim().split("\n");
}

console.log(`
Test cases:
BFFFBBFRRR: ${seatNumber("BFFFBBFRRR")} == 567
FFFBBBFRRR: ${seatNumber("FFFBBBFRRR")} == 119
BBFFBBFRLL: ${seatNumber("BBFFBBFRLL")} == 820
`);

const sortedSeats = getInput()
  .map(seatNumber)
  .sort((a, b) => a - b);
const highestNumber = sortedSeats[sortedSeats.length - 1];
const missingSeat = findMissingSeat(sortedSeats);

console.log(`
Problem 1 -- highest value: ${highestNumber}
Problem 2 -- mising seat: ${findMissingSeat(sortedSeats)}
`);
