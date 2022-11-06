//const {stdin: input, stdout: output} = require('process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const folderIn = 'styles';
const folderOut = 'project-dist';

//let data = [];

async function readingFolder(name, extname) {
  try {
    console.log('ReadFolder Start');
    let arrFiles = [];
    const files = await fs.promises.readdir(path.join(__dirname, name), {withFileTypes: true});
    for (const file of files) {
      if (file.isFile() && ((extname.localeCompare(path.extname(file.name))) === 0)) {
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

function recoursiveReadAndWriteFile (namesRead, nameWrite, folderRead, folderWrite) {

  if (!namesRead.length) {
    console.log(`Read All Files to ${nameWrite} Done`);
  } else {
    console.log(`Read File ${namesRead[0]} to ${nameWrite} Start`);
    const writableFile = fs.createWriteStream(path.join(__dirname, folderWrite, nameWrite), {flags: 'a'});
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, folderRead, namesRead.shift())),
      output: writableFile
    });
    readInterface.on('line', (line) => {
      writableFile.write(`${line}\n`);
    });
    readInterface.on('close', () => {
      console.log(`End read file`);
      recoursiveReadAndWriteFile(namesRead, nameWrite, folderRead, folderWrite);
    });
  }
  }

async function deleteFilesInDir(nameFolder) {
  console.log('DeleteFolder Start');
  let filesForDelete = await readingFolder(nameFolder, '.css');

  for (let i = 0; i < filesForDelete.length; i++) {
    await fs.promises.unlink(path.join(__dirname, nameFolder, filesForDelete[i]), function(err) {
      if(err) return console.log(err);
    });
  }
  console.log('DeleteFolder Done');
}

//Самовызывающаяся функция для работы async... await в корне программы
(async ()=> {

  let filesName = await readingFolder(folderIn, '.css'); //Читаем файлы в исходной папке

  await deleteFilesInDir(folderOut);

  recoursiveReadAndWriteFile(filesName, 'bundle.css', folderIn, folderOut);

})();