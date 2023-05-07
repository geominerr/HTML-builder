const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, 'secret-folder');

function readDirectory(src) {
  fs.readdir(src, (error, files) => {
    if (error) {
      console.error(error);
      return;
    }

    files.forEach((file) => {
      let fullPath = path.join(src, file);

      fs.stat(fullPath, (error, stats) => {
        if (error) {
          console.error(error);
          return;
        }

        if (stats.isFile()) {
          const fileFormat = path.extname(fullPath);
          const fileName = path.basename(fullPath, fileFormat);
          const fileSize = stats.size;
          const outputLine = `${fileName} - ${fileFormat.slice(1)} - ${fileSize}b`;

          console.log(outputLine);
        }
      });
    });
  });
}

readDirectory(fullPath);
