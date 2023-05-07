const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

function writeTextToFile() {
  const fullPath = path.join(__dirname, 'new-file.txt');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let content = '';

  addTextFile(fullPath, content);
  console.log('Enter your message!');

  rl.on('line', (input) => {
    if (input === 'exit') {
      exitHandler();
    }
    content = input;

    addTextFile(fullPath, content);
  });

  rl.on('SIGINT', exitHandler);
}

writeTextToFile();
