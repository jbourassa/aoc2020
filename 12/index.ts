#!/usr/bin/env npm run ts-node

import fs from "fs";

type Point = [number, number];
type Instruction = [Navigation, number];

function move(point: Point, dx : number, dy : number): Point {
  let [x, y] = point;
  return [x + dx, y + dy];
}

type NavigationState = {
  dir: Direction,
  loc: Point,
}

interface Navigation {
  navigate(state: NavigationState, n: number) : NavigationState;
  waypoint(point: Point, n: number) : Point;
}

class Direction implements Navigation {
  public static North = new Direction("N", 0, -1);
  public static East = new Direction("E", 1, 0);
  public static South = new Direction("S", 0, 1);
  public static West = new Direction("W", -1, 0);

  public static Ordered = [
    Direction.North,
    Direction.East,
    Direction.South,
    Direction.West,
  ] as const;

  private constructor(
    public name: string,
    private dx: number,
    private dy: number,
  ) {}

  navigate(state: NavigationState, n: number) {
    return {
      dir: state.dir,
      loc: move(state.loc, n * this.dx, n * this.dy),
    };
  }

  waypoint(point: Point, n: number) : Point {
    return move(point, n * this.dx, n * this.dy);
  }
}

class Rotation {
  public static Right = new Rotation(1);
  public static Left = new Rotation(-1);
  private constructor(public multiplier: number) {};

  navigate(state: NavigationState, n: number) {
    let i = Direction.Ordered.indexOf(state.dir);
    if(i === -1) {
      throw new Error(`Bad state: unknown direction '${state.dir.name}'`)
    }

    let turns = this.multiplier % 360 * n / 90;
    let newIndex = (i + turns + Direction.Ordered.length) % Direction.Ordered.length;

    return {
      dir: Direction.Ordered[newIndex],
      loc: state.loc,
    };
  }

  waypoint(point: Point, n: number) : Point {
    let angle = this.multiplier * n * Math.PI / 180;
    return [
      Math.round(Math.cos(angle) * (point[0]) - Math.sin(angle) * (point[1])),
      Math.round(Math.sin(angle) * (point[0]) + Math.cos(angle) * (point[1])),
    ];
  }
}

class ForwardClass implements Navigation {
  navigate(state: NavigationState, n: number) {
    return state.dir.navigate(state, n);
  }

  waypoint(point: Point, _n: number) : Point {
    return point;
  }
}

const Forward = new ForwardClass();

function toNavigation(string: string) : Navigation {
  switch(string) {
    case "N": return Direction.North;
    case "S": return Direction.South;
    case "E": return Direction.East;
    case "W": return Direction.West;
    case "L": return Rotation.Left;
    case "R": return Rotation.Right;
    case "F": return Forward;
  }

  throw new Error(`Invalid Direction: ${string}`);
}

function getInput(): string {
  return fs.readFileSync("12/input.txt").toString().trim();
}

function parseInput(input: string): Instruction[] {
  return input.split("\n")
    .map((line) => {
      let [letter, ...rest] = line.split("");
      return [toNavigation(letter), parseInt(rest.join(""), 10)];
    });
}

function solve1(instructions: Instruction[]): number {
  let state : NavigationState = {
    dir: Direction.East,
    loc: [0, 0]
  };

  instructions.forEach(([navigation, number]) => {
    state = navigation.navigate(state, number);
  });

  return Math.abs(state.loc[0]) + Math.abs(state.loc[1]);
}

function solve2(instructions: Instruction[]): number {
  let waypoint: Point = [10, -1];

  let state : NavigationState = {
    dir: Direction.East,
    loc: [0, 0]
  };


  instructions.forEach(([navigation, number]) => {
    if(navigation === Forward) {
      state.loc = move(state.loc, waypoint[0] * number, waypoint[1] * number);
    }
    waypoint = navigation.waypoint(waypoint, number);
  });

  return Math.abs(state.loc[0]) + Math.abs(state.loc[1]);
}

const testInput = `F10
N3
F7
R90
F11`;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 25`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

console.log(`Test 2: ${solve2(parseInput(testInput))} =?= 286`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
