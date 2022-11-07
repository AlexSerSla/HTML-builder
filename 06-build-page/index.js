const readline = require('readline');
const path = require('path');
const fs = require('fs');

async function makeDirectory(pathDir, name) {
  try {
    console.log('MakeDir Start');
    const projectFolder = path.join(pathDir, name);
    const dirCreation = await fs.promises.mkdir(projectFolder, { recursive: true });

    //console.log(dirCreation);
    console.log('MakeDir Done');
    return dirCreation;

  } catch (error) {
    console.error(error);
  }
}


async function readingFolder(pathDir, obj = 'files', extname = 'all') {
  try {
    console.log('ReadFolder Start');
    let arrFiles = [];
    const files = await fs.promises.readdir(path.join(pathDir), {withFileTypes: true});
    for (const file of files) {
      switch (obj) {
        case 'folders':
          if (!file.isFile()) {
            arrFiles.push(path.join(`${file.name}`));
          }
          break;
        default:
          switch (extname) {
            case 'all':
              if (file.isFile()) {
                arrFiles.push(path.join(`${file.name}`));
              }
              break;
            default:
              if (file.isFile() && ((extname.localeCompare(path.extname(file.name))) === 0)) {
                arrFiles.push(path.join(`${file.name}`));
              }
              break;
          }
          break;
      }
    }
    //console.log(arrFiles);
    console.log('ReadFolder Done');
    return arrFiles;
  } catch (err) {
    console.error(err);
  }
}

async function copyFile(name, srcFolderPath, destFolderPath) {
  try {
    console.log(`CopyFile Start: ${name}`);
    await fs.promises.copyFile(path.join(srcFolderPath, name), path.join(destFolderPath, name));
    console.log(`CopyFile Done: ${name}`);

  } catch (error) {
    console.log('The file could not be copied');
    console.error(error);
  }
}

async function deleteInDir(pathDir, obj = 'files') {
  console.log('DeleteFolder Start');
  let filesForDel = await readingFolder(pathDir);
  let folderForDel = await readingFolder(pathDir, 'folders');
  console.log(folderForDel);
  switch (obj) {
    case 'all':
      if (folderForDel.length) {
        for (const folderName of folderForDel) {
          await deleteInDir(path.join(pathDir, folderName), 'all');
        }
        for (const folderName of folderForDel) {
          fs.rmdir(path.join(pathDir, folderName), err => {
            if(err) throw err; // не удалось удалить папку
            console.log('Папка успешно удалена');
         });
         console.log('Все папки успешно удалены');
        }
      }
      for (let i = 0; i < filesForDel.length; i++) {
        await fs.promises.unlink(path.join(pathDir, filesForDel[i]), function(err) {
          if(err) return console.log(err);
        });
      }
      console.log('Все файлы успешно удалены');

      break;

    default:
      for (let i = 0; i < filesForDel.length; i++) {
        await fs.promises.unlink(path.join(pathDir, filesForDel[i]), function(err) {
          if(err) return console.log(err);
        });
      }
      break;
  }

  console.log('DeleteFolder Done');
}

async function recoursiveReadAndWriteFile (namesRead, nameWrite, folderRead, folderWrite) {
  if (!namesRead.length) {
    console.log(`Read All Files to ${nameWrite} Done`);
  } else {
    console.log(`Read File ${namesRead[0]} to ${nameWrite} Start`);
    const readName = namesRead.shift();
    const writableFile = fs.createWriteStream(path.join(__dirname, folderWrite, nameWrite), {flags: 'a'});
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, folderRead, readName)),
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

  function readFilesInFolder (pathFolder) {
    console.log('Start read file');
    let dataArr = [];
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path.join(pathFolder)),
      //output: process.stdout
    });
    readInterface.on('line', (line) => {
      dataArr.push(line);
    });
    readInterface.on('close', () => {
      console.log(`End read file`);
    });
    return dataArr;
  }

  function createPageArr(componentsObj, templateArr) {
    let arrComponents = [];
    for (const key in componentsObj) {
      arrComponents.push(key);
      }
    for (const component of arrComponents) {
      let indexComponent = templateArr.findIndex((item) => {
        if (item.includes(component) ) {
          return true;
        }
      });
      console.log(`Index ${component}: ${indexComponent}`);
  
      templateArr.splice(indexComponent, 1, ...componentsObj[component]);
      //console.log(templateArr);
    }
    return templateArr;
  }
  function createHtmlPage(arrHtml, path) {
    const writeHtmlStream = fs.createWriteStream(path/*, {flags: 'a'}*/);

    arrHtml.forEach(value => writeHtmlStream.write(`${value}\n`));

    writeHtmlStream.on('finish', () => {
       console.log(`Done write index.html`);
    });
    writeHtmlStream.on('error', (err) => {
        console.error(`${err}`)
    });
    writeHtmlStream.end();
  }

//Самовызывающаяся функция для работы async... await в корне программы
(async ()=> {

  //Запись в массив файла template.html
  let arrTemplate = readFilesInFolder(path.join(__dirname, 'template.html'));

  //Чтение папки components с компонентами html и запись найденных файлов в обьект массивов
  let htmlComponentsNames = await readingFolder(path.join(__dirname, 'components'), 'files', '.html');
  let htmlComponents = {};
  for await (const fileName of htmlComponentsNames) {
    htmlComponents[fileName.split('.')[0]] = [];
    htmlComponents[fileName.split('.')[0]] = readFilesInFolder(path.join(__dirname, 'components', fileName));
  }

  //Создание папки project-dist
  let makedDir = await makeDirectory(path.join(__dirname), 'project-dist');

  if (makedDir === undefined) {
    await deleteInDir(path.join(__dirname, 'project-dist'), 'all');  //Если директория была создана, то удаляем из нее все файлы
  }

  //Чтение файлов из папки assets и копирование ее и ее содержимого в папку project-dist
  await makeDirectory(path.join(__dirname, 'project-dist'), 'assets');

  let foldersInDir = await readingFolder(path.join(__dirname, 'assets'), 'folders');
  console.log(foldersInDir);

  for (const folder of foldersInDir) {
    //console.log(folder);
    await makeDirectory(path.join(__dirname, 'project-dist', 'assets'), folder);
    let filesInDir = await readingFolder(path.join(__dirname, 'assets', folder));
    console.log(filesInDir);
    for (const file of filesInDir) {
      await copyFile(file, path.join(__dirname, 'assets', folder), path.join(__dirname, 'project-dist', 'assets', folder));  //Копируем файлы в директорию назначения
    }
  }

  //Чтение файлов из папки styles и сборка из них файла style.css в папке project-dist
  let filesInStyleDir = await readingFolder(path.join(__dirname, 'styles'));
  //console.log(filesInStyleDir);

  recoursiveReadAndWriteFile(filesInStyleDir, 'style.css', 'styles', 'project-dist');

  //Сборка финальной страницы из шаблона и компонентов и запись ее в файл

  let resultHtml = createPageArr(htmlComponents, arrTemplate);
  //console.log(resultHtml);
  createHtmlPage(resultHtml, path.join(__dirname, 'project-dist', 'index.html'));
})();