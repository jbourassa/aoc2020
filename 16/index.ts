#!/usr/bin/env npm run ts-node

import fs from "fs";

function getInput(): string {
  return fs.readFileSync("16/input.txt").toString().trim();
}

type Range = [number, number];
type Restriction = { name: string, ranges: Range[] }
type Ticket = number[]
type Input = {
  restrictions: Restriction[],
  my: Ticket,
  other: Ticket[],
};

function parseInput(input: string): Input {
  let int = (n: string) => parseInt(n, 10);

  let [section1, section2, section3] = input.split("\n\n");
  let restrictions = section1
    .split("\n")
    .map(line => {
      let [name, details] = line.split(":");
      if(!name || !details) {
        throw new Error(`Invalid line: ${line}`);
      }

      let rangeStrings = details.match(/(\d+-\d+)/g);
      if(!rangeStrings) throw new Error(`Invalid line: ${line}`);

      let ranges = rangeStrings.map((range) : Range => {
          let [min, max] = range.split("-").map(int)
          return [min, max];
        })

      return { name, ranges };
    });
  let my = section2.split("\n")[1].split(",").map(int);
  let other = section3
    .split("\n")
    .slice(1)
    .map(line => line.split(",").map(int));

  return { restrictions, my, other }
}

function inRanges(n : number, ranges: Range[]) : boolean {
  return ranges.some(range => range[0] <= n && n <= range[1]);
}

function solve1(input: Input): number {
  let invalidNumbers = input.other
    .map((ticket) => {
      return ticket.filter((n) => {
        return !input.restrictions.some((r) => inRanges(n, r.ranges))
      });
    });

  return invalidNumbers.flat().reduce((a, b) => a + b, 0)
}

function solve2(input: Input): number {
  let validOthers = input.other
    .filter((ticket) => {
      return ticket.every((n) => {
        return input.restrictions.some((r) => inRanges(n, r.ranges))
      });
    });

  let association = input.restrictions
    .reduce((acc: {[key: string]: number[]}, { name, ranges }) => {
      acc[name] = [];
      for(let i = 0; i < input.restrictions.length; i++) {
        if(validOthers.every(ticket => inRanges(ticket[i], ranges))) {
          acc[name].push(i);
        }
      }
      return acc;
    }, {});

  let resolved = new Set(
    Object.values(association).filter(n => n.length === 1).flat()
  )

  while(resolved.size !== Object.keys(association).length) {
    for (let name in association) {
      if(association[name].length === 1) continue;

      association[name] = association[name].filter(n => !resolved.has(n));

      if(association[name].length === 1) {
        resolved.add(association[name][0]);
      }
    }
  }

  return Object
    .keys(association)
    .filter(s => s.startsWith("departure"))
    .reduce((acc, key) => acc * input.my[association[key][0]], 1)
}

const testInput = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 71`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
