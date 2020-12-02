import fs from "fs";

class PasswordPolicy {
  char: string;
  rule1: number;
  rule2: number;

  constructor(char: string, rule1: number, rule2: number) {
    this.char = char;
    this.rule1 = rule1;
    this.rule2 = rule2;
  }

  valid1(password: string): boolean {
    let matches = 0;
    for (let char of password) {
      if (char == this.char) matches++;
      if (matches > this.rule2) return false;
    }

    return matches >= this.rule1;
  }

  valid2(password: string): boolean {
    let i1 = this.rule1 - 1;
    let i2 = this.rule2 - 1;
    return (password[i1] === this.char) !== (password[i2] === this.char);
  }
}

function getInput(): [PasswordPolicy, string][] {
  const extractFormat = /(\d+)-(\d+) (\w): (\w+)/;
  return fs
    .readFileSync("02/input.txt")
    .toString()
    .trim()
    .split("\n")
    .map((s) => {
      let match = s.match(extractFormat);
      if (!match || match.length < 5) throw new Error(`Can't parse line: ${s}`);

      return [
        new PasswordPolicy(match[3], parseInt(match[1]), parseInt(match[2])),
        match[4],
      ];
    });
}

const input = getInput();

console.log("Problem 1 -- valid passwords count:");
console.log(
  input.filter(([policy, password]) => policy.valid1(password)).length
);

console.log("-----");
console.log("-----");

console.log("Problem 2 -- valid passwords count:");
console.log(
  input.filter(([policy, password]) => policy.valid2(password)).length
);
