#!/usr/bin/env npm run ts-node

import fs from "fs";
import util from "util"
import _ from "lodash"

type Board3d = Map<number, Map<number, Map<number, string>>>;
type Point3d = [number, number, number];

function range(start: number, stop: number) : number[] {
  return Array(stop + 1 - start).fill(start).map((x, y) => x + y)
}

class B3d {
  public b: Board3d;

  constructor() {
    this.b = new Map<number, Map<number, Map<number, string>>>();
  }

  points() : Point3d[] {
    let points : Point3d[] = []
    let allX = Array.from(this.b.keys());
    let allY = Array.from(this.b.values())
      .flatMap(map => Array.from(map.keys()))
    let allZ = Array.from(this.b.values())
      .flatMap(map => Array.from(map.values()))
      .flatMap(map => Array.from(map.keys()))

    let [minX, maxX] = [_.min<number>(allX) || 0, _.max<number>(allX) || 0];
    let [minY, maxY] = [_.min<number>(allY) || 0, _.max<number>(allY) || 0];
    let [minZ, maxZ] = [_.min<number>(allZ) || 0, _.max<number>(allZ) || 0];

    for(let i = minX - 1; i <= maxX + 1; i++) {
      for(let j = minY - 1; j <= maxY + 1; j++) {
        for(let k = minZ - 1; k <= maxZ + 1; k++) {
          points.push([i, j, k]);
        }
      }
    }

    return points;
  }

  at([x, y, z]: Point3d) : string {
    let mapy = this.b.get(x);
    let mapz = mapy && mapy.get(y);
    return mapz && mapz.get(z) || "."
  }

  set([x, y, z]: Point3d) {
    const mapy = this.b.get(x) || new Map<number, Map<number, string>>();
    this.b.set(x, mapy);

    const mapz = mapy.get(y) || new Map<number, string>();
    mapy.set(y, mapz);

    mapz.set(z, "#");
  }

  neighbours([x, y, z]: Point3d): Point3d[] {
    const all: Point3d[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          if (i === 1 && j === 1 && k === 1) continue;
          all.push([
            x - 1 + i,
            y - 1 + j,
            z - 1 + k,
          ]);
        }
      }
    }

    return all;
  }

  tick() {
    const ticked = new B3d();
    for(const point of this.points()) {
      let current = this.at(point);
      let activeNeighbours = this
        .neighbours(point)
        .filter((neighbour => this.at(neighbour) === "#"))
        .length;

      if(current === "#" && activeNeighbours === 2 || activeNeighbours === 3) {
        ticked.set(point);
      }

      if(current === "." && activeNeighbours === 3) {
        ticked.set(point);
      }
    }

    return ticked;
  }
}


type Board4d = Map<number, Map<number, Map<number, Map<number, string>>>>;
type Point4d = [number, number, number, number];

class B4d {
  public b: Board4d;

  constructor() {
    this.b = new Map<number, Map<number, Map<number, Map<number, string>>>>();
  }

  points() : Point4d[] {
    let points : Point4d[] = []
    let allX = Array.from(this.b.keys());
    let allY = Array.from(this.b.values())
      .flatMap(map => Array.from(map.keys()))
    let allZ = Array.from(this.b.values())
      .flatMap(map => Array.from(map.values()))
      .flatMap(map => Array.from(map.keys()))
    let all$ = Array.from(this.b.values())
      .flatMap(map => Array.from(map.values()))
      .flatMap(map => Array.from(map.values()))
      .flatMap(map => Array.from(map.keys()))

    let [minX, maxX] = [_.min<number>(allX) || 0, _.max<number>(allX) || 0];
    let [minY, maxY] = [_.min<number>(allY) || 0, _.max<number>(allY) || 0];
    let [minZ, maxZ] = [_.min<number>(allZ) || 0, _.max<number>(allZ) || 0];
    let [min$, max$] = [_.min<number>(all$) || 0, _.max<number>(all$) || 0];

    for(let i = minX - 1; i <= maxX + 1; i++) {
      for(let j = minY - 1; j <= maxY + 1; j++) {
        for(let k = minZ - 1; k <= maxZ + 1; k++) {
          for(let h = min$ - 1; h <= max$ + 1; h++) {
            points.push([i, j, k, h]);
          }
        }
      }
    }

    return points;
  }

  at([x, y, z, $]: Point4d) : string {
    let mapy = this.b.get(x);
    let mapz = mapy && mapy.get(y);
    let map$ = mapz && mapz.get(z);
    return map$ && map$.get($) || "."
  }

  set([x, y, z, $]: Point4d) : void {
    const mapy = this.b.get(x) || new Map<number, Map<number, Map<number, string>>>();
    this.b.set(x, mapy);

    const mapz = mapy.get(y) || new Map<number, Map<number, string>>();
    mapy.set(y, mapz);

    const map$ = mapz.get(z) || new Map<number, string>();
    mapz.set(z, map$);

    map$.set($, "#");
  }

  neighbours([x, y, z, $]: Point4d): Point4d[] {
    const all: Point4d[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          for (let h = 0; h < 3; h++) {
            if (i === 1 && j === 1 && k === 1 && h === 1) continue;
            all.push([
              x - 1 + i,
              y - 1 + j,
              z - 1 + k,
              $ - 1 + h,
            ]);
          }
        }
      }
    }

    return all;
  }

  tick() {
    const ticked = new B4d();
    for(const point of this.points()) {
      let current = this.at(point);
      let activeNeighbours = this
        .neighbours(point)
        .filter((neighbour => this.at(neighbour) === "#"))
        .length;

      if(current === "#" && activeNeighbours === 2 || activeNeighbours === 3) {
        ticked.set(point);
      }

      if(current === "." && activeNeighbours === 3) {
        ticked.set(point);
      }
    }

    return ticked;
  }
}

function getInput(): string {
  return fs.readFileSync("17/input.txt").toString().trim();
}

function parseInput1(input: string): B3d {
  let b = new B3d();
  input
    .split("\n")
    .forEach((line, y) => {
      line.split("").forEach((s, x) => s === "#" && b.set([x, y, 0]))
    });

  return b;
}

function solve1(b: B3d): number {
  for(let i = 0; i < 6; i++) {
    b = b.tick();
  }

  return b.points().filter((point) => b.at(point) === "#").length
}

function parseInput2(input: string): B4d {
  let b = new B4d();
  input
    .split("\n")
    .forEach((line, y) => {
      line.split("").forEach((s, x) => s === "#" && b.set([x, y, 0, 0]))
    });

  return b;
}

function solve2(b: B4d): number {
  for(let i = 0; i < 6; i++) {
    b = b.tick();
  }

  return b.points().filter((point) => b.at(point) === "#").length
}

const testInput = `.#.
..#
###`;
console.log(`Test 1: ${solve1(parseInput1(testInput))} =?= 112`);
console.log(`Solve 1: ${solve1(parseInput1(getInput()))}`);
console.log(`Solve 2: ${solve2(parseInput2(getInput()))}`);