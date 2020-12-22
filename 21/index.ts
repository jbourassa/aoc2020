#!/usr/bin/env npm run ts-node

import fs from "fs";

// From MDN
function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  let _intersection = new Set<T>();
  for (let elem of setB) {
    if (setA.has(elem)) _intersection.add(elem);
  }
  return _intersection;
}

function getInput(): string {
  return fs.readFileSync("21/input.txt").toString().trim();
}

type InputItem = [string[], string[]];
function parseInput(input: string): InputItem[] {
  return input.split("\n").map((line) => {
    let match = line.match(/([a-z ]+) \(contains ([a-z ,]+)\)/);
    if (!match) throw new Error("Malformed line: " + line);
    let clean = (strings: string[]): string[] =>
      strings.map((s) => s.trim()).filter((s) => !!s);
    return [clean(match[1].split(" ")), clean(match[2].split(", "))];
  });
}

function solve(input: InputItem[]): Map<string, Set<string>> {
  let allergensIngredients = new Map<string, Set<string>>();
  input.forEach(([ingredients, allergens]) => {
    allergens.forEach((allergen) => {
      let set = intersection(
        allergensIngredients.get(allergen) || new Set(ingredients),
        new Set(ingredients)
      );
      allergensIngredients.set(allergen, set);
    });
  });

  let changed = true;
  let solvedIngredients = new Set(
    Array.from(allergensIngredients.values())
      .filter((a) => a.size === 1)
      .map((a) => Array.from(a.values()))
      .flat()
  );

  while (changed) {
    changed = false;
    for (let [_, ingredients] of allergensIngredients.entries()) {
      if (ingredients.size === 1) continue;
      for (let ingredient of ingredients.values()) {
        if (solvedIngredients.has(ingredient)) {
          ingredients.delete(ingredient);
        }
      }
      if (ingredients.size === 1) {
        solvedIngredients.add(Array.from(ingredients.values())[0]);
        changed = true;
      }
    }
  }

  return allergensIngredients;
}

function solve1(input: InputItem[]): number {
  let badIngredients = new Set(
    Array.from(solve(input).values())
      .map((s) => [...s.values()])
      .flat()
  );
  let allIngredients = input.map(([ingredients, _]) => ingredients).flat();
  return allIngredients.filter((i) => !badIngredients.has(i)).length;
}

function solve2(input: InputItem[]): string {
  let allergens = solve(input);
  return Array.from(allergens.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([_, values]) => Array.from(values))
    .join(",");
}

const testInput = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 5`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

console.log(`Test 2: ${solve2(parseInput(testInput))} =?= ??`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
