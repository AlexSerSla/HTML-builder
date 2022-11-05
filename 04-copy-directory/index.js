const process = require('process');
const path = require('path');
const fs = require('fs');

let makedDir = '';
let filesName = [];
const dirSrcName = 'files';
const dirDestName = 'files-copy';

async function makeDirectory(name) {
  try {
    console.log('MakeDir Start');
    const projectFolder = path.join(__dirname, name);
    const dirCreation = await fs.promises.mkdir(projectFolder, { recursive: true });

    //console.log(dirCreation);
    console.log('MakeDir Done');
    return dirCreation;

  } catch (error) {
    console.error(error);
  }
}

async function readingFolder(name) {
  try {
    console.log('ReadFolder Start');
    let arrFiles = [];
    const files = await fs.promises.readdir(path.join(__dirname, name), {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        arrFiles.push(path.join(`${file.name}`));
      }
    }
    //console.log(arrFiles);
    console.log('ReadFolder Done');
    return arrFiles;
  } catch (err) {
    console.error(err);
  }
}

async function copyFile(name, srcFolder, destFolder) {
  try {
    console.log(`CopyFile Start: ${name}`);
    await fs.promises.copyFile(path.join(__dirname, srcFolder, name), path.join(__dirname, destFolder, name));
    console.log(`CopyFile Done: ${name}`);

  } catch (error) {
    console.log('The file could not be copied');
    console.error(error);
  }
}

async function deleteFilesInDir(name) {
  console.log('DeleteFolder Start');
  let filesForDelete = await readingFolder(name);

  for (let i = 0; i < filesForDelete.length; i++) {
    await fs.promises.unlink(path.join(__dirname, name, filesForDelete[i]), function(err) {
      if(err) return console.log(err);
    });
  }
  console.log('DeleteFolder Done');
}

//Самовызывающаяся функция для работы async... await в корне программы
(async ()=> {

  filesName = await readingFolder(dirSrcName); //Читаем файлы в исходной папке
  makedDir = await makeDirectory(dirDestName); //Создаем директорию назначения

  if (makedDir === undefined) {
    await deleteFilesInDir(dirDestName);  //Если директория была создана, то удаляем из нее все файлы
  }

  for (const element of filesName) {
    await copyFile(element, dirSrcName, dirDestName);  //Копируем файлы в директорию назначения
  }
})();