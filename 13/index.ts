#!/usr/bin/env npm run ts-node

import fs from "fs";

function getInput(): string {
  return fs.readFileSync("13/input.txt").toString().trim();
}

type Input1 = { now: number, buses: number[] };
function parseInput1(input: string): Input1 {
  let [now, busLine] = input.split("\n");
  return {
    now: parseInt(now, 10),
    buses: busLine
      .split(",")
      .filter(num => num !== "x")
      .map(num => parseInt(num, 10))
  }
}

function solve1({ now, buses } : Input1): number {
  let busIn = (n : number) : number =>  n - now % n;
  let nextBus = buses[0];

  buses.forEach(bus => {
    if(busIn(bus) < busIn(nextBus)) {
      nextBus = bus;
    }
  });

  return nextBus * busIn(nextBus);
}

type Input2 = [number, number];
function parseInput2(input: string): Input2[] {
  return input
    .split("\n")[1].toString()
    .split(",")
    .flatMap((n, i) => (n === "x") ? [] : [[i, parseInt(n, 10)]])
}

function solve2(constraints: Input2[]): number {
  // Chinese Remainder Theorem -- all modulos are primes.
  // t0 ≡ bus - delay (mod bus)

  let modInverse = (a : bigint, m : bigint) : bigint => {
    a = a % m;
    for (let i = BigInt(0); i < m; i++) {
      if((a * i) % m === BigInt(1)) return i;
    }

    return BigInt(1);
  }

  let chineseRemainder = (entries: [bigint, bigint][]) : bigint => {
    let N = entries.reduce((acc, [_, mod]) => acc * mod, BigInt(1));

    let x = entries
      .map(([val, mod])  => {
        const bi = val % mod;
        const Ni = N / mod;
        const xi = modInverse(Ni, mod);

        return bi * Ni * xi;
      })
      .reduce((a, b) => a + b, BigInt(0));
    return x % N
  }

  return Number(
    chineseRemainder(
      constraints.map(([delay, bus]) => [BigInt(bus - delay), BigInt(bus)])
    )
  );
}

const testInput = `939
7,13,x,x,59,x,31,19`;

console.log(`Test 1: ${solve1(parseInput1(testInput))} =?= 295`);
console.log(`Solve 1: ${solve1(parseInput1(getInput()))}`);

console.log(`Test 2.1: ${solve2(parseInput2("\n17,x,13,19"))} =?= 3417`);
console.log(`Test 2.2: ${solve2(parseInput2(testInput))} =?= 1068781`);
console.log(`Test 2.3: ${solve2(parseInput2("\n67,7,59,61"))} =?= 754018`);
console.log(`Test 2.4: ${solve2(parseInput2("\n67,x,7,59,61"))} =?= 779210`);
console.log(`Test 2.5: ${solve2(parseInput2("\n67,7,x,59,61"))} =?= 1261476`);
console.log(`Test 2.6: ${solve2(parseInput2("\n1789,37,47,1889"))} =?= 1202161486`);
console.log(`Solve 2: ${solve2(parseInput2(getInput()))}`);
