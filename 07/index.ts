import fs from "fs";
function getInput(): string {
  return fs.readFileSync("07/input.txt").toString().trim();
}

type Bag = { n: number; color: string };
type Bags = { [key: string]: Bag[] };

function parseInput(input: string): Bags {
  let bags: Bags = {};
  input.split("\n").forEach((string) => {
    let [color, contains] = string.split(" bags contain ");
    if (!color || !contains) throw new Error("Can't parse: " + string);

    if (contains.includes("no other bag")) {
      bags[color] = [];
      return;
    }

    bags[color] = contains.split(", ").map((s) => {
      let match = s.match(/(\d+ )?(\w+ \w+)/);
      if (match && match[1] && match[2]) {
        return { n: parseInt(match[1], 10), color: match[2] };
      } else {
        throw new Error("Invalid input: " + s);
      }
    });
  });

  return bags;
}

function solve1(allBags: Bags): number {
  function searchFor(needle: string): string[] {
    let newFound = Object.keys(allBags).filter((color) =>
      allBags[color]!!.map((b) => b.color).includes(needle)
    );

    return newFound.concat(
      newFound.reduce((acc: string[], color) => {
        return acc.concat(searchFor(color));
      }, [])
    );
  }

  return new Set(searchFor("shiny gold")).size;
}

function solve2(allBags: Bags): number {
  function rec(color: string): number {
    let ret =
      allBags[color]
        .map((bag) => bag.n * rec(bag.color))
        .reduce((a, b) => a + b, 0) + 1;

    return ret;
  }

  return rec("shiny gold") - 1;
}

console.log(`
Test suite
-----------
Solve 1:
${solve1(
  parseInput(`light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`)
)} == 4

-----------
Solve 2:
${solve2(
  parseInput(`shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`)
)} == 126
`);

console.log(`
Problem 1 -- shiny gold parents: ${solve1(parseInput(getInput()))}

Problem 1 -- shiny gold includes: ${solve2(parseInput(getInput()))}`);
