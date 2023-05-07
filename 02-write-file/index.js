const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const fullPath = path.join(__dirname, 'new-file.txt');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let content = '';

function exitHandler() {
  console.log('Good bye!');
  process.exit();
}

function addTextFile(path, content) {
  fs.appendFile(path, content, (error) => {
    if (error) {
      console.error(error);
      return;
    }
  });
}

function writeTextToFile(path, content) {
  addTextFile(path, content);
  console.log('Enter your message!');

  rl.on('line', (input) => {
    if (input === 'exit') {
      exitHandler();
    }
    content = input;

    addTextFile(path, content);
  });
}

process.on('SIGTERM', exitHandler);

writeTextToFile(fullPath, content);
