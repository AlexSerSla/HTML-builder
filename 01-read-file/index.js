const path = require('path');
const fs = require('fs');

const readableStream = fs.ReadStream(path.join(__dirname, "text.txt"), "utf-8"); //Создаем поток чтения файла text.txt
let data = ""; //Переменная, хранящая содержимое файла (набирается из частей(чанков) потока)

readableStream.on("data", (chunk) => data += chunk); //Событие чтения файла
readableStream.on("end", () => process.stdout.write(data + "\n")); //Событие звершения чтения файла
readableStream.on('error', error => console.log('Error', error.message)); //ССобытие обработчик ошибки чтения файла
