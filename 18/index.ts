#!/usr/bin/env npm run ts-node

import fs from "fs";

type RecArray = Array<RecArray | string | number>;

function getInput(): string[] {
  return fs.readFileSync("18/input.txt").toString().trim().split("\n");
}

function parseInput(input: string): RecArray {
  let tokens = input.trim()
    .replace(/([()])/g, " $& ")
    .split(/\s+/)

  let root : RecArray = [];
  let back : RecArray = [];
  let current = root;

  tokens.forEach((tok) => {
    if (tok === "(") {
      back.push(current)
      current = [];
    }
    else if (tok === ")") {
      let tmp = back.pop();
      if(!Array.isArray(tmp)) throw new Error("Malformed input!");
      tmp.push(current);
      current = tmp;
    }
    else if (tok === "*" || tok === "+") {
      current.push(tok);
    }
    else if (tok.match(/\d+/)) {
      current.push(parseInt(tok, 10));
    }
  });

  return root;
}

let add = (a: number, b: number) => a + b;
let mul = (a: number, b: number) => a * b;

let makeReducer = (reducer: (eq: RecArray) => number ) => function reduce(eq: RecArray | number | string) : number {
  if (typeof eq === "string") throw new Error("Malformed input: non-operand string found");
  if (typeof eq === "number") return eq;
  if (eq.length === 0) return 0;
  if (eq.length === 1) return reduce(eq[0]);

  return reducer(eq);
}

let reduce = makeReducer(function(eq: RecArray) : number {
  let [l, op, r, ...rest] = eq;
  let reduced = (op === "*" ? mul : add)(reduce(l), reduce(r));
  return reduce([reduced, ...rest])
});

let reduce2 = makeReducer(function(eq: RecArray) : number {
  let apply = (eq: RecArray, op: string, fn: (a: number, b: number) => number) : RecArray => {
    let current = eq;
    let i = 1;
    while (current[i]) {
      if (current[i] === op) {
        current = current
          .slice(0, i-1)
          .concat([fn(reduce2(current[i-1]), reduce2(current[i+1]))])
          .concat(current.slice(i + 2))
      }
      else {
        i += 2;
      }
    }
    return current;
  }

  return reduce2(apply(apply(eq, "+", add), "*", mul));
});

function solve1(eqs: RecArray[]): number {
  return eqs.reduce((acc, eq) => acc + reduce(eq), 0);
}

function solve2(eqs: RecArray[]): number {
  return eqs.reduce((acc, eq) => acc + reduce2(eq), 0);
}

const testInput = `((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`;
console.log(`Test 1: ${reduce(parseInput(testInput))} =?= 13632`);
console.log(`Solve 1: ${solve1(getInput().map(parseInput))}`);

console.log(`Test 2: ${reduce2(parseInput(testInput))} =?= ??`);
console.log(`Solve 2: ${solve2(getInput().map(parseInput))}`);