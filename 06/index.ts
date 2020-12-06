import fs from "fs";

function intersection<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  return new Set<T>(Array.from(s1).filter((x) => s2.has(x)));
}

function getInput(): {
  size: number;
  different: number;
  allYes: number;
}[] {
  return fs
    .readFileSync("06/input.txt")
    .toString()
    .trim()
    .split("\n\n")
    .map((s) => {
      let lines = s.split("\n");
      let allAnswers = lines.join("").split("");
      let answersPerPerson = lines.map((l) => new Set(l.split("")));
      return {
        size: lines.length,
        different: new Set(allAnswers).size,
        allYes: (answersPerPerson.length
          ? answersPerPerson.reduce(intersection, answersPerPerson[0])
          : new Set([])
        ).size,
      };
    });
}

const input = getInput();
console.log(`
Problem 1 -- summing counts: ${input.reduce((n, obj) => obj.different + n, 0)}

Problem 2 -- questions where everyone said yes: ${input.reduce(
  (n, obj) => obj.allYes + n,
  0
)}`);
