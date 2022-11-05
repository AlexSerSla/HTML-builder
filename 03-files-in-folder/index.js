const process = require('process');
const path = require('path');
const fs = require('fs');

async function readFolder() {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, "secret-folder"), {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        const name = `${file.name.split('.')[0]} - ${path.extname(file.name).split('.')[1]}`;
        fs.stat(path.join(__dirname, "secret-folder", file.name), function(err, stats) {
          console.log(`${name} - ${(stats.size) / 1000}kB`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readFolder();
