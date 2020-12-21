#!/usr/bin/env npm run ts-node

import fs from "fs";
import _ from "lodash";

type Image = string[][];

function emptyImage(length: number) : Image {
  return (new Array(length)).fill(null).map(() => new Array(length).fill(""));
}

function rotate(base: Image) : Image {
  let max = base.length - 1;
  let rotated = emptyImage(base.length);

  for (let row = 0; row < base.length; row++) {
    for (let col = 0; col < base.length; col++) {
      rotated[col][max - row] = base[row][col];
    }
  }

  return rotated;
};

function flipv(base: Image) : Image {
  let flipped = emptyImage(base.length);

  let max = base.length - 1;
  for (let row = 0; row < base.length; row++) {
    for (let col = 0; col < base.length; col++) {
      flipped[max - row][col] = base[row][col];
    }
  }
  return flipped;
}

function rotate3Times(base: Image): Image[] {
  let rotated = [];
  for (let i = 0; i < 3; i++) {
    base = rotate(base);
    rotated.push(base);
  }

  return rotated;
}

function imageVariations(base: Image): Image[] {
  let variations = [base];
  let flipped = flipv(base);

  return [base, flipped]
    .concat(rotate3Times(base))
    .concat(rotate3Times(flipped))
}

class Tile {
  static fromString(str: string) : Tile {
    let [header, ...content] = str.split("\n").filter(s => !!s);
    let headerMatch = header.match(/Tile (\d+):/);
    if (!headerMatch) throw new Error("Can't parse tile: " + str);
    let id = parseInt(headerMatch[1], 10);
    let pixels = content.map(line => line.split(""));

    return new Tile(id, pixels);
  }

  public id: number;
  private base: Image;
  public orientations: Image[];

  // Assumes base is square.
  constructor(id: number, base: Image) {
    this.id = id;
    this.base = base;
    this.orientations = imageVariations(this.base);
  }

}

type BoardTile = { tile: Tile, image: Image };
type MaybeBoardTitle = BoardTile | undefined;
class Board {
  tiles: MaybeBoardTitle[];
  count: number;

  constructor(size: number) {
    this.count = Math.sqrt(size);
    this.tiles = new Array<MaybeBoardTitle>(size).fill(undefined);
  }

  get(row: number, col: number) : MaybeBoardTitle {
    if(row < 0 || col < 0) return undefined;
    return this.tiles[(row * this.count + col)];
  }

  fill(tile: Tile, image: Image) : null | Board {
    let toFill = this.tiles.indexOf(undefined);
    if (toFill === -1) throw new Error("Already full!");
    let row = Math.floor(toFill / this.count);
    let col = toFill % this.count;
    let neighbour : MaybeBoardTitle;

    if (neighbour = (this.get(row - 1, col))) {
      if (this.row(neighbour.image, -1) !== this.row(image, 0)) {
        return null;
      }
    }

    if (neighbour = (this.get(row, col - 1))) {
      if (this.col(neighbour.image, -1) !== this.col(image, 0)) {
        return null;
      }
      else {
      }
    }

    let board = new Board(this.count * this.count);
    this.tiles.forEach((t, i) => t && board.set(i, t));
    board.set(toFill, { tile: tile, image: image });
    return board;
  }

  set(index: number, tile: BoardTile) : void {
    this.tiles[index] = tile;
  }

  isFull() : boolean {
    return this.tiles.every((t => !!t));
  }

  private row(image: Image, at: number) : string {
    if (at < 0) at = image.length + at;
    return image[at].join("");
  }

  private col(image: Image, at: number) : string {
    if (at < 0) at = image.length + at;
    return image.map(row => row[at]).join("");
  }
}

function getInput(): string {
  return fs.readFileSync("20/input.txt").toString().trim();
}

function parseInput(input: string): Tile[] {
  return input.split("\n\n").map(blob => Tile.fromString(blob));
}

function solve(board: Board, tiles: Tile[]) : Board | null {
  if (board.isFull()) {
    return board;
  }

  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];

    for (let j = 0; j < tile.orientations.length; j++) {
      let newboard = board.fill(tile, tile.orientations[j]);
      let solved = newboard && solve(newboard, _.without(tiles, tile));
      if (solved) return solved;
    }
  }
  return null;
}

function solve1(tiles: Tile[]): bigint {
  let board = new Board(tiles.length);
  let solved = solve(board, tiles);
  if(!solved) throw new Error("Unsolved!");
  return BigInt(solved.get(0, 0)?.tile.id  || 0) *
    BigInt(solved.get(0, solved.count-1)?.tile.id || 0) *
    BigInt(solved.get(solved.count-1, 0)?.tile.id || 0) *
    BigInt(solved.get(solved.count-1, solved.count-1)?.tile.id || 0);
}

const MONSTER = [
  [18],
  [0, 5, 6, 11, 12, 17, 18, 19],
  [1, 4, 7, 10, 13, 16],
] as const; 

function matchAt(line: string[], offset: number, positions: readonly number[]) : boolean {
  return positions.every(pos => line[pos + offset] === "#");
}

function findMonsters(l1: string[], l2: string[], l3: string[]): number {
  let found = 0;
  for (let j = 0; j < l1.length - MONSTER[2].length; j++) {
    if (!matchAt(l1, j, MONSTER[0])) continue;
    if (!matchAt(l2, j, MONSTER[1])) continue;
    if (!matchAt(l3, j, MONSTER[2])) continue;

    found++;
  }
  
  return found;
}

function solve2(tiles: Tile[]): number {
  let board = new Board(tiles.length);
  let solved = solve(board, tiles) as Board;
  if(!solved) throw new Error("Unsolved!");
  let trimmedImages = solved.tiles.map((t) => {
    if (!t) throw new Error("Unsolved!");
    return t.image.slice(1, -1).map(rows => rows.slice(1, -1));
  });
  let merged = emptyImage(solved.count * trimmedImages[0].length);
  trimmedImages.forEach((img, imgi) => {
    let boardrow = Math.floor(imgi / solved.count);
    let boardcol = imgi % solved.count;

    img.forEach((row, rowi) => {
      row.forEach((val, coli) => {
        let newrow = boardrow * img.length + rowi;
        let newcol = boardcol * img.length + coli
        merged[newrow][newcol] = val;
      });
    });
  });

  // Possible issues:
  // - Finding monsters doesn't work
  // - Stuff not wired up OK
  // - Image merging no work. 

  let monstersFound = imageVariations(merged).map((image) => {
    let found = 0;
    for (let i = 2; i < image.length; i++) {
      found += findMonsters(image[i - 2], image[i - 1], image[i]);
    }

    return found;
  });

  let occupiedPixels = merged.flat().filter((char) => char === "#").length;
  let monsterPixels = (_.max(monstersFound) || 0) * MONSTER.flat().length;

  return  occupiedPixels - monsterPixels;
}

const testInput = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;
console.log(`Test 1: ${solve1(parseInput(testInput))} =?= 20899048083289`);
console.log(`Solve 1: ${solve1(parseInput(getInput()))}`);

console.log(`Test 2: ${solve2(parseInput(testInput))} =?= 273`);
console.log(`Solve 2: ${solve2(parseInput(getInput()))}`);
