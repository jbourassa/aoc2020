#!/usr/bin/env npm run ts-node

import fs from "fs";

type Op = [number, number];
type OpGroup = { mask: string, ops: Op[]}

function getInput(): string {
  return fs.readFileSync("14/input.txt").toString()
}

function parseInput(input: string): OpGroup[] {
  return input
    .split("mask = ")
    .slice(1)
    .map((block) => {
      let [mask, ...ops] = block.split("\n").filter(s => !!s);
      return {
        mask: mask.trim(),
        ops: ops.map((line) => {
          let tokens = line.match(/mem\[(\d+)\] = (\d+)/);
          if(!tokens) throw new Error(`Unknown operation: ${line}`);

          return [parseInt(tokens[1], 10), parseInt(tokens[2], 10)];
        })
      }
    });
}

let zeros = [...Array(36)].map(() => "0").join("");
function bitmask(mask: string, n: number) : number {
  if(mask.length != 36) throw new Error("Invalid mask lenght: " + mask);

  let nBits = (zeros + n.toString(2)).slice(-36);
  let maskedString = "";

  for(let i = 0; i < 36; i++) {
    maskedString += (mask[i] === "X" ? nBits[i] : mask[i])
  }

  return parseInt(maskedString, 2);
}


function solve1(groups: OpGroup[]): number {
  let mem : { [key: number]: number } = {};
  groups.forEach(({ mask, ops }) => {
    ops.forEach(([addr, value]) => {
      mem[addr] = bitmask(mask, value);
    });
  });

  return Object.values(mem).reduce((a, b) => a + b, 0);
}

function floatmask(prefix: string, mask: string, bits: string) : number[] {
  if(mask === "") {
    return [parseInt(prefix, 2)];
  }

  if(mask[0] === "0") {
    return floatmask(prefix + bits[0], mask.slice(1), bits.slice(1));
  }

  if(mask[0] === "1") {
    return floatmask(prefix + "1", mask.slice(1), bits.slice(1));
  }

  if(mask[0] === "X") {
    let with0 = floatmask(prefix + "0", mask.slice(1), bits.slice(1))
    let with1 = floatmask(prefix + "1", mask.slice(1), bits.slice(1))
    return with0.concat(with1);
  }

  throw new Error("Unknown mask value: " + mask[0]);
}

function solve2(groups: OpGroup[]): number {
  let mem : { [key: number]: number } = {};

  groups.forEach(({ mask, ops }) => {
    ops.forEach(([addr, value]) => {
      let bits = (zeros + addr.toString(2)).slice(-36);
      floatmask("", mask, bits).forEach((n) => {
        mem[n] = value;
      });
    });
  });
  return Object.values(mem).reduce((a, b) => a + b, 0);
}

const testInput = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 165`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

const testInput2 = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;

console.log(`Test 2: ${solve2(parseInput(testInput2))} =?= 208`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
