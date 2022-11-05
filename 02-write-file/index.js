/*const process = require('process');

const {stdin: input, stdout: output} = require('process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface(input, output);
const writableFile = fs.createWriteStream(path.join(__dirname, "out-text.txt"),);

function readData() {
  readInterface.question('Сообщение: ', (answer) => {
  if (('exit'.localeCompare(answer.toString())) === 0) {
    output.write(`\nДо свидания!`);
    readInterface.close();
  } else {
    output.write(`Строка записана: ${answer}\n`);
    writableFile.write(`${answer}\n`);
    readData();
  }
});
}

readData();

readInterface.on('SIGINT', () => {
  output.write(`\nДо свидания!`);
  readInterface.close();
});
*/

const {stdin: input, stdout: output} = require('process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const writableFile = fs.createWriteStream(path.join(__dirname, "out-text.txt"),);
const readInterface = readline.createInterface({
  input,
  output,
  prompt: 'Ваша строка > '
});

output.write('Привет! Введи строку!\n')

readInterface.prompt();

readInterface.on('line', (line) => {
  //console.log(line.length);
  switch (line) {
    case 'exit':
      output.write('До свидания!\n');
      process.exit(0);
    case '':
      output.write('Введена пустая строка, записи в файл не произошло! Попробуйте снова.\n');
      break;
    default:
      writableFile.write(`${line}\n`);
      output.write(`Строка записана: '${line}'\n`);
      break;
  }
  readInterface.prompt();
});

readInterface.on('close', () => {
  output.write('\nДо свидания!');
  process.exit(0);
});


