#!/usr/bin/env npm run ts-node

function parseInput(input: string): number[] {
  return input.split(",").map(l => parseInt(l, 10));
}

function solve(input: number[], max: number): number {
  let spoken = new Array(max);
  let lastSpoken : { [key: number]: number[]} = {};

  input.forEach((v, i) => spoken[i] = v);

  function speak(n: number, i: number) : void {
    spoken[i] = n;
    lastSpoken[n] = (lastSpoken[n] || []).concat([i]).slice(-2);
  }

  for(let i = 0; i < max; i++) {
    if (i % 500000 === 0) { console.log("Tick!", i); }
    if(spoken[i] !== undefined) {
      speak(spoken[i], i);
      continue;
    }

    let prev = spoken[i-1];
    let prevLastSpoken = lastSpoken[prev]
    if(prevLastSpoken && prevLastSpoken.length === 2) {
      speak(lastSpoken[prev][1] - lastSpoken[prev][0], i)
    }
    else {
      speak(0, i)
    }
  }

  return spoken[max-1];
}

console.log(`Test 1: ${solve(parseInput(`0,3,6`), 2020)} =?= 436`);
console.log(`Solve 1: ${solve(parseInput(`2,0,1,9,5,19`), 2020)}`);
 console.log(`Solve 2: ${solve(parseInput(`2,0,1,9,5,19`), 30000000)}`);
