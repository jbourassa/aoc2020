#!/usr/bin/env npm run ts-node

import fs from "fs";

function getInput(): string {
  return fs.readFileSync("10/input.txt").toString().trim();
}

function parseInput(input: string): number[] {
  return input
    .split("\n")
    .map(l => parseInt(l, 10))
    .sort((a, b) => a - b);
}

function solve1(numbers: number[]): number {
  let jolt = 0;
  let i = 0;
  let occurences : { [key: number]: number } = {};
  let inc = (n: number) : void => { occurences[n] = (occurences[n] || 0) + 1 }
  while(i < numbers.length) {
    if (numbers[i] > jolt && numbers[i] - jolt <= 3) {
      inc(numbers[i] - jolt)
      jolt = numbers[i];
    }
    i++
  }

  return occurences[1] * occurences[3];
}

function solve2(numbers: number[]): number {
  numbers = [0].concat(numbers);

  let _cache : { [key: number] : number } = {};
  let cached = (i: number, fn: () => number) : number => {
    if(_cache[i] === undefined)  {
      _cache[i] = fn();
    }
    return _cache[i];
  }

  let solutionsStartingAt = (at : number) : number => {
    if(at === numbers.length - 1) {
      return 1;
    }

    let acc = 0;
    let i = at + 1;

    while(i < numbers.length  && numbers[i] - numbers[at] <= 3) {
      acc += cached(i, () => solutionsStartingAt(i));
      i++;
    }

    return acc;
  }

  return solutionsStartingAt(0);
}

const testInput = `16
10
15
5
1
11
7
19
6
12
4`;

console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 35`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

console.log(`Test 2: ${solve2(parseInput(testInput))} =?= 8`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
