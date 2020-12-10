#!/usr/bin/env npm run ts-node

import fs from "fs";

function getInput(): string {
  return fs.readFileSync("09/input.txt").toString().trim();
}

function binsearch(numbers: number[], i: number, j: number, needle: number) : number | null {
  let m = i + Math.floor((j-i) / 2);

  if (numbers[m] === needle) {
    return m;
  }

  if (needle < numbers[i] || needle > numbers[j] || i >= j) {
    return null;
  }

  if (needle < numbers[m]) {
    return binsearch(numbers, i, m-1, needle);
  }
  else {
    return binsearch(numbers, m+1, j, needle);
  }
}

function parseInput(input: string): number[] {
  return input.split("\n").map(l => parseInt(l, 10));
}


function solve1(numbers: number[], preamble: number = 25): number {
  let current = preamble;
  let low = 0;
  let slice = numbers.slice(low, current).sort((a, b) => a - b);
  let found;
  let needle;

  while(true) {
    needle = numbers[current] - numbers[low];
    found = binsearch(slice, 0, preamble - 1, needle)

    if(found && found !== (current - preamble - 1 + low)) {
      current++;
      low = current - preamble;
      slice = numbers.slice(low, current).sort((a, b) => a - b);
    }
    else if(++low === current) {
      return numbers[current];
    }
  }
}

function solve2(numbers: number[], preamble: number = 25): number {
  let desiredSum = solve1(numbers, preamble);

  for(let i = 0; i < numbers.length; i++) {
    let acc = numbers[i];
    let min = acc;
    let max = acc;

    for(let j = i + 1; j < numbers.length; j++) {
      acc += numbers[j];
      max = Math.max(numbers[j], max);
      min = Math.min(numbers[j], min);

      if(acc === desiredSum) {
        return min + max;
      }
      if (acc > desiredSum) break;
    }
  }

  return 0;
}

const testInput = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`

console.log(`Test 1: ${solve1(parseInput(testInput), 5)} =?= 127`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

console.log(`Test 2: ${solve2(parseInput(testInput), 5)} =?= 62`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
