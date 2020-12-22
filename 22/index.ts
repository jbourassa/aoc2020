#!/usr/bin/env npm run ts-node

import fs from "fs";

function getInput(): string {
  return fs.readFileSync("22/input.txt").toString().trim();
}

type Deck = number[];
type TwoDecks = [Deck, Deck];
function parseInput(input: string): TwoDecks {
  let [p1, p2] = input.split("\n\n").map((s) =>
    s
      .split("\n")
      .slice(1)
      .map((card) => parseInt(card, 10))
  );
  return [p1, p2];
}

function score(deck: Deck): number {
  return deck.reduce((acc, card, i) => acc + card * (deck.length - i), 0);
}

function solve1([p1, p2]: TwoDecks): number {
  while (p1.length > 0 && p2.length > 0) {
    let c1 = p1.shift() as number;
    let c2 = p2.shift() as number;
    if (c1 > c2) {
      p1.push(c1, c2);
    } else {
      p2.push(c2, c1);
    }
  }

  let winner = p1.length > p2.length ? p1 : p2;
  return score(winner);
}

function solve2(decks: TwoDecks): number {
  let combat = (p1: Deck, p2: Deck): TwoDecks => {
    let seen = new Set<string>();
    while (p1.length > 0 && p2.length > 0) {
      let key = `${p1.join(",")}|${p2.join(",")}`;
      if (seen.has(key)) return [p1, []];
      seen.add(key);

      let c1 = p1.shift()!;
      let c2 = p2.shift()!;

      let p1wins: boolean;
      if (p1.length >= c1 && p2.length >= c2) {
        let [p1prime, _] = combat(p1.slice(0, c1), p2.slice(0, c2));
        p1wins = p1prime.length > 0;
      } else {
        p1wins = c1 > c2;
      }

      if (p1wins) {
        p1.push(c1, c2);
      } else {
        p2.push(c2, c1);
      }
    }
    return [p1, p2];
  };

  let [p1, p2] = combat([...decks[0]], [...decks[1]]);
  let winner = p1.length > p2.length ? p1 : p2;
  return score(winner);
}

const testInput = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 306`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);
console.log(`Test 2: ${solve2(parseInput(testInput))} =?= 291`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
