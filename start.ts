#!/usr/bin/env npm run ts-node

import fs from "fs";

const lastarg = process.argv[process.argv.length - 1];
let day = `0${(new Date().getDate().toString())}`.slice(-2);
if(lastarg.match(/\d\d/)) {
  day = lastarg;
}

let content = fs.readFileSync("template.ts").toString();
fs.mkdirSync(day, { recursive: true });
fs.writeFileSync(`${day}/index.ts`, content.replace("${DAY}", day));
console.log("Have fun!");
