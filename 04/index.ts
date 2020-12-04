import fs from "fs";

const REQUIRED_KEYS = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const EYE_COLORS = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
type Attributes = { [key: string]: string };

class Passport {
  attributes: Attributes;

  constructor(attributes: Attributes) {
    this.attributes = attributes;
  }

  valid1(): boolean {
    return REQUIRED_KEYS.every((key) => !!this.attributes[key]);
  }

  valid2(): boolean {
    if (!this.valid1()) return false;
    let attributes = this.attributes;

    if (attributes.byr?.length != 4) return false;
    if (!(attributes.byr >= "1920" && attributes.byr <= "2002")) return false;

    if (attributes.iyr?.length != 4) return false;
    if (!(attributes.iyr >= "2010" && attributes.iyr <= "2020")) return false;

    if (attributes.eyr?.length != 4) return false;
    if (!(attributes.eyr >= "2020" && attributes.eyr <= "2030")) return false;

    if (!attributes.hgt) return false;
    let heightMatch = attributes.hgt.match(/(\d+)(in|cm)/);
    if (!heightMatch) return false;
    let heightNumber = parseInt(heightMatch[1]);
    if (heightMatch[2] == "cm") {
      if (heightNumber < 150 || heightNumber > 193) return false;
    } else if (heightMatch[2] == "in") {
      if (heightNumber < 59 || heightNumber > 76) return false;
    }
    if (!attributes.hcl?.match(/^#[0-9a-f]{6}$/)) return false;
    if (!EYE_COLORS.includes(attributes.ecl)) return false;
    if (attributes.pid?.length !== 9) return false;

    return true;
  }
}

function getInput(): Passport[] {
  return fs
    .readFileSync("04/input.txt")
    .toString()
    .split("\n\n")
    .map((passportString) => {
      return new Passport(
        passportString
          .split(/[\s\n]/g)
          .map((s) => s.trim())
          .reduce((attributes: Attributes, bits: string) => {
            let tokens = bits.split(":");
            attributes[tokens[0]] = tokens[1];
            return attributes;
          }, {})
      );
    });
}

const passports = getInput();

console.log("Problem 1 -- valid passports");
console.log(`Total passports: ${passports.length}`);
console.log(`Valid count: ${passports.filter((p) => p.valid1()).length}`);

console.log("\n");

console.log("Problem 2 -- more validation");
console.log(`Total passports: ${passports.length}`);
console.log(`Valid count: ${passports.filter((p) => p.valid2()).length}`);
