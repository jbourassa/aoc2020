#!/usr/bin/env npm run ts-node

import fs from "fs";
import _ from "lodash";

function getInput(): string {
  return fs.readFileSync("24/input.txt").toString().trim();
}

class Moves {
  private static map = new Map([
    // ne: 1, e: 2, se: 3, sw: 4, w: 5, nw: 6
    [1, [1, -1]],
    [2, [2, 0]],
    [3, [1, 1]],
    [4, [-1, 1]],
    [5, [-2, 0]],
    [6, [-1, -1]],
  ]);

  public static all = Array.from(Moves.map.entries()).map(([_, p]) => p);

  static get(i: number) {
    let dir = Moves.map.get(i);
    if (!dir) {
      throw new Error("Unknown dir: " + dir);
    }

    return dir;
  }
}

type Point = [number, number];
class Board {
  private map: Map<string, Point>;

  constructor() {
    this.map = new Map<string, Point>();
  }

  flip(point: Point): void {
    let key = point.join(",");
    if (this.map.has(key)) {
      this.map.delete(key);
    } else {
      this.map.set(key, point);
    }
  }

  tick(): Board {
    const ticked = new Board();
    let neighbours = (point: Point): Point[] =>
      Moves.all.map((move) => [point[0] + move[0], point[1] + move[1]]);

    let all = _(Array.from(this.map.entries()))
      .flatMap(([_, point]) => neighbours(point).concat([point]))
      .uniqBy((point: Point) => point.join(","))
      .value();

    all.forEach((point) => {
      let blackAdjacent = neighbours(point).filter((p) => this.ticked(p)).length;

      if (this.ticked(point)) {
        if (blackAdjacent === 1 || blackAdjacent === 2) ticked.flip(point);
      } else if (blackAdjacent === 2) {
        ticked.flip(point);
      }
    });

    return ticked;
  }

  get black(): number {
    return this.map.size;
  }

  private ticked(point: [number, number]): boolean {
    return this.map.has(point.join(","));
  }
}

function parseInput(input: string): [number, number][] {
  // ne: 1, e: 2, se: 3, sw: 4, w: 5, nw: 6
  return input
    .replace(/ne/g, "1")
    .replace(/se/g, "3")
    .replace(/sw/g, "4")
    .replace(/nw/g, "6")
    .replace(/e/g, "2")
    .replace(/w/g, "5")
    .split("\n")
    .map((line) => {
      return line
        .split("")
        .map((n) => Moves.get(parseInt(n, 0)))
        .reduce(
          (acc: [number, number], move) => {
            acc[0] += move[0];
            acc[1] += move[1];
            return acc;
          },
          [0, 0]
        );
    });
}

function solve1(tiles: [number, number][]): number {
  const board = new Board();
  tiles.forEach((point) => board.flip(point));
  return board.black;
}

function solve2(tiles: [number, number][]): number {
  let board = new Board();
  tiles.forEach((point) => board.flip(point));
  for (let i = 0; i < 100; i++) board = board.tick();
  return board.black;
}

const testInput = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 10`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);
console.log(`Test 2: ${solve2(parseInput(testInput))} =?= 2208`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
