const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

function copyDir(src, dest) {
  fs.access(dest, (error) => {
    if (error) {
      copyFile(src, dest);
    } else {
      fs.rm(dest, { recursive: true }, (error) => {
        if (error) {
          console.error(error);
          return;
        }

        copyFile(src, dest);
      });
    }
  });
}

function copyFile(src, dest) {
  fs.mkdir(dest, { recursive: true }, (error) => {
    if (error) {
      console.error(error);
    }

    fs.readdir(src, (error, files) => {
      if (error) {
        console.error(error);
        return;
      }

      files.forEach((file) => {
        let pathToFile = path.join(src, file);

        fs.stat(pathToFile, (error, stats) => {
          if (error) {
            console.error(error);
            return;
          }

          const pathToCopy = path.join(dest, file);

          if (stats.isFile()) {
            fs.copyFile(pathToFile, pathToCopy, 0, (error) => {
              if (error) {
                console.error(error);
                return;
              }
            });
          } else if (stats.isDirectory()) {
            return copyFile(pathToFile, pathToCopy);
          }
        });
      });
    });
  });
}
copyDir(sourceDir, destDir);
