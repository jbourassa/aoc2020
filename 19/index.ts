#!/usr/bin/env npm run ts-node

import fs from "fs";

function getInput(): string {
  return fs.readFileSync("19/input.txt").toString().trim();
}

type RuleRefs = number[][]; // top level are "or", nested are "and"
type RuleChar = string;
type Rule = RuleChar | RuleRefs;
type RuleSet = Map<number, Rule>;
type Input = [RuleSet, string[]];

function parseRuleBody(string: string): Rule {
  let charmatch = string.match(/"(\w)"/);

  if (charmatch) return charmatch[1];

  return string.split(" | ").map((subrule) => {
    return subrule.split(" ").map((n) => parseInt(n, 10));
  });
}

function parseInput(input: string): Input {
  let [part1, part2] = input.split("\n\n");

  let ruleset = part1.split("\n").reduce((ruleset, row) => {
    let [ruleid, rulestring] = row.split(": ");
    ruleset.set(parseInt(ruleid, 10), parseRuleBody(rulestring));
    return ruleset;
  }, new Map<number, Rule>());

  return [ruleset, part2.trim().split("\n")];
}

function solve(ruleset: RuleSet, fullmessage: string): boolean {
  function stripRule(ruleid: number, message: string): string[] {
    let rule = ruleset.get(ruleid) as Rule;
    if (message === "") return [];
    if (typeof rule === "string") {
      return rule === message[0] ? [message.substr(1)] : [];
    }
    return rule.reduce((acc, ruleSeqIds) => {
      return acc.concat(stripRuleSeq(ruleSeqIds, message));
    }, [] as string[]);
  }

  function stripRuleSeq(ruleids: number[], message: string): string[] {
    let [head, ...rest] = ruleids;
    if (!head) {
      return [message];
    }

    let stripped = stripRule(head, message);
    return stripped.reduce((acc, s) => acc.concat(stripRuleSeq(rest, s)), [] as string[]);
  }

  return stripRule(0, fullmessage).includes("");
}

function solve1([ruleset, messages]: Input): number {
  return messages.filter((message) => solve(ruleset, message)).length;
}

function solve2([ruleset, messages]: Input): number {
  ruleset.set(8, [[42], [42, 8]]);
  ruleset.set(11, [
    [42, 31],
    [42, 11, 31],
  ]);

  return messages.filter((message) => solve(ruleset, message)).length;
}

const testInput = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;

console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 2`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

const testInput2 = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`;
console.log(`Test 2: ${solve2(parseInput(testInput2))} =?= 12`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
