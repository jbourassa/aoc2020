#!/usr/bin/env npm run ts-node

import _ from "lodash";

function transform(loopSize: number, subject: number): number {
  let value = 1;
  _.times(loopSize, () => (value = (value * subject) % 20201227));
  return value;
}

function findLoopSize(pubkey: number): number {
  const subject = 7;
  let i = 1;
  let value = subject;
  while (true) {
    if (value === pubkey) return i;
    value = (value * subject) % 20201227;
    i++;
  }
}
function solve1([cardPubKey, doorPubKey]: [number, number]): number {
  let cardLoopSize = findLoopSize(cardPubKey);
  let doorLoopSize = findLoopSize(doorPubKey);
  return transform(cardLoopSize, doorPubKey);
}

function solve2(numbers: number[]): number {
  return 0;
}

const testInput: [number, number] = [5764801, 17807724];
const input: [number, number] = [9789649, 3647239];
console.log(`Test 1: ${solve1(testInput)} =?= 14897079`);
console.log(`Solve 1: ${solve1(input)}`);

//console.log(`Test 2: ${solve2(parseInput(testInput))} =?= ??`);
//console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
