#!/usr/bin/env npm run ts-node

import fs from "fs";

function getInput(): string {
  return fs.readFileSync("${DAY}/input.txt").toString().trim();
}

function parseInput(input: string): number[] {
  return input.split("\n").map(l => parseInt(l, 10));
}

function solve1(numbers: number[]): number {
  return 0;
}

function solve2(numbers: number[]): number {
  return 0;
}

const testInput = ``;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= ??`);
//console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

//console.log(`Test 2: ${solve2(parseInput(testInput))} =?= ??`);
//console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
