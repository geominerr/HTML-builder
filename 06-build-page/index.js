const fs = require('fs');
const path = require('path');

function createProjectBuild() {
  const dist = path.join(__dirname, 'project-dist');

  fs.access(dist, (error) => {
    if (error) {
      createProjectDir(dist);
    } else {
      fs.rm(dist, { recursive: true }, (error) => {
        if (error) {
          console.error(error);
          return;
        }
        createProjectDir(dist);
      });
    }
  });
}

function createProjectDir(dist) {
  fs.mkdir(dist, (error) => {
    if (error) {
      console.error(error);
      return;
    }

    const pathToAssets = path.join(__dirname, 'assets');
    const pathToCopy = path.join(dist, 'assets');

    copyAssets(pathToAssets, pathToCopy);
    createBundleCSS();
    createBundleHTML();
  });
}

function copyAssets(src, dist) {
  fs.mkdir(dist, (error) => {
    if (error) {
      console.error(error);
      return;
    }

    fs.readdir(src, (error, files) => {
      if (error) {
        console.error(error);
        return;
      }

      files.forEach((file) => {
        const pathToFile = path.join(src, file);

        fs.stat(pathToFile, (error, stats) => {
          if (error) {
            console.error(error);
            return;
          }

          const pathToCopy = path.join(dist, file);

          if (stats.isFile()) {
            fs.copyFile(pathToFile, pathToCopy, 0, (error) => {
              if (error) {
                console.error(error);
                return;
              }
            });
          } else if (stats.isDirectory()) {
            return copyAssets(pathToFile, pathToCopy);
          }
        });
      });
    });
  });
}

function createBundleCSS() {
  const src = path.join(__dirname, 'styles');
  const bundle = path.join(__dirname, 'project-dist', 'style.css');

  fs.readdir(src, (error, files) => {
    if (error) {
      console.error(error);
      return;
    }

    fs.writeFile(bundle, '', (error) => {
      if (error) {
        console.error(error);
        return;
      }
    });

    files.forEach((file) => {
      const fullPath = path.join(src, file);

      fs.stat(fullPath, (error, stats) => {
        if (error) {
          console.error(error);
          return;
        }

        if (stats.isFile() && path.extname(fullPath) === '.css') {
          appendFile(fullPath, bundle);
        }
      });
    });
  });
}

function appendFile(src, dist) {
  const stream = fs.createReadStream(src, 'utf8');

  stream.on('data', (chunk) => {
    fs.appendFile(dist, chunk, (error) => {
      if (error) {
        console.error(error);
        return;
      }
    });
  });
}

function createBundleHTML() {
  const src = path.join(__dirname, 'template.html');
  const bundle = path.join(__dirname, 'project-dist', 'index.html');
  const componentsPath = path.join(__dirname, 'components');
  let template = '';

  fs.readFile(src, 'utf-8', (error, data) => {
    if (error) {
      console.log(error);
    }
    template = data;

    fs.writeFile(bundle, '', (error) => {
      if (error) {
        console.error(error);
        return;
      }
    });

    fs.readdir(componentsPath, (error, files) => {
      if (error) {
        console.error(error);
        return;
      }

      files.forEach((file) => {
        const fullPath = path.join(componentsPath, file);

        fs.stat(fullPath, (error, stats) => {
          if (error) {
            console.error(error);
            return;
          }

          if (stats.isFile() && path.extname(fullPath) === '.html') {
            const component = path.basename(fullPath).slice(0, -5);
            const regex = new RegExp(`{{\\s*${component}\\s*}}`, 'g');

            fs.readFile(fullPath, 'utf8', (error, data) => {
              template = template.replace(regex, data);

              fs.writeFile(bundle, template, (error) => {
                if (error) {
                  console.error(error);
                  return;
                }
              });
            });
          }
        });
      });
    });
  });
}
createProjectBuild();
