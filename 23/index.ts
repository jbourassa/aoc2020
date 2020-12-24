#!/usr/bin/env npm run ts-node

function getInput(): string {
  return "872495136";
}

function parseInput(input: string): number[] {
  return input.split("").map((l) => parseInt(l, 10));
}

class Node {
  next: Node | null;
  constructor(public value: number) {
    this.next = null;
  }

  toArray(): number[] {
    let current: Node = this;
    let array: number[] = [];
    while (true) {
      array.push(current.value);
      if (!current || current.next === this) break;
      current = current.next!;
    }
    return array;
  }

  dropNext3(): Node {
    let first = this.next!;
    let current: Node = this;

    for (let i = 0; i < 3; i++) current = current!.next!;
    this.next = current!.next;
    current.next = null;

    return first;
  }

  add(node: Node): void {
    let nextWas = this.next;
    this.next = node;
    while (node.next) node = node.next;
    node.next = nextWas;
  }

  includes(n: number): boolean {
    let current: Node | null = this;
    while (current) {
      if (current.value === n) return true;
      current = current.next;
    }
    return false;
  }
}

function solve(input: number[], ticks: number): Map<number, Node> {
  function findDestination(dropped: Node, current: number): number {
    while (current--) {
      if (current === 0) {
        current = numbers.get(input.length)!.value;
      }

      if (!dropped.includes(current)) {
        return current;
      }
    }
    return current; // Just satisfying the type system :(
  }

  let numbers = new Map<number, Node>();
  let nodes = input.map((i) => new Node(i));
  for (let i = 0; i < input.length; i++) {
    let node = nodes[i];
    node.next = nodes[(i + 1) % input.length];
    numbers.set(node.value, node);
  }

  let current = input[0];
  for (let tick = 0; tick < ticks; tick++) {
    let currentNode = numbers.get(current)!;
    let dropped = currentNode.dropNext3();
    current = currentNode.next!.value;
    let destination = findDestination(dropped, currentNode.value);
    let destinationNode = numbers.get(destination)!;
    destinationNode.add(dropped);
  }

  return numbers;
}

function solve1(input: number[]): string {
  let numbers = solve(input, 100);
  let current = numbers.get(1)!;
  let result = "";
  while (current.next!.value !== 1) {
    result += (current = current!.next!).value;
  }
  return result;
}

function solve2(input: number[]): number {
  for (let i = 0; i < 1000000; i++) {
    let value = input[i] || i + 1;
    input[i] = value;
  }

  let numbers = solve(input, 10000000);
  return numbers.get(1)!.next!.value * numbers.get(1)!.next!.next!.value;
}

const testInput = `389125467`;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 67384529`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

console.log(`Test 2: ${solve2(parseInput(testInput))} =?= 149245887792`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
