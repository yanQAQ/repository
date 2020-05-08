const compressing = require('compressing');
const path = require('path');
const fs = require("fs")

let fileName = path.join(__dirname, 'dist')
let outName = path.join(__dirname, '../dist.zip')

let copyArr = [
  {
    fileName: "./des/1.11.json",
    outFileName: "./dist/ban.json"
  },
  {
    fileName: "./logs/app-err.log",
    outFileName: "./dist/app-err.log"
  }
]

copyArr.forEach(e => {

  fs.writeFileSync(path.join(__dirname, e.outFileName), fs.readFileSync(path.join(__dirname, e.fileName)))

})

compressing.zip.compressDir(fileName, outName, { ignoreBase: true })
  .then(() => {
    console.log('success');
  })
  .catch(err => {
    console.error(err);
  });