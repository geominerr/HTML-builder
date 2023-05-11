const fsPromises = require('fs/promises');
const path = require('path');

createProjectDir()
  .then(() => copyAssets())
  .then(() => createBundleCSS())
  .then(() => createBundleHTML())
  .catch((error) => console.log(error));

async function createProjectDir() {
  const dist = path.join(__dirname, 'project-dist');

  if (await isHasDirectory(dist)) {
    await fsPromises.rm(dist, { recursive: true });
  }

  await fsPromises.mkdir(dist, { recursive: true });
}

async function isHasDirectory(dist) {
  try {
    await fsPromises.access(dist);
  } catch (error) {
    return false;
  }

  return true;
}

async function copyAssets(...args) {
  let src = path.join(__dirname, 'assets');
  let dist = path.join(__dirname, 'project-dist', 'assets');

  if (args.length) {
    src = args[0];
    dist = args[1];
  }

  try {
    await fsPromises.mkdir(dist, { recursive: true });
    const files = await fsPromises.readdir(src);

    for (const file of files) {
      const pathToFile = path.join(src, file);
      const pathToCopy = path.join(dist, file);
      const stats = await fsPromises.stat(pathToFile);

      if (stats.isFile()) {
        await fsPromises.copyFile(pathToFile, pathToCopy);
      } else if (stats.isDirectory()) {
        await copyAssets(pathToFile, pathToCopy);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function createBundleCSS() {
  const src = path.join(__dirname, 'styles');
  const bundle = path.join(__dirname, 'project-dist', 'style.css');

  try {
    await fsPromises.writeFile(bundle, '');
    const files = await fsPromises.readdir(src);

    for (const file of files) {
      const pathToFile = path.join(src, file);
      const stats = await fsPromises.stat(pathToFile);

      if (stats.isFile() && path.extname(pathToFile) === '.css') {
        const temp = await fsPromises.readFile(pathToFile, 'utf8');
        await fsPromises.appendFile(bundle, temp);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function createBundleHTML() {
  const src = path.join(__dirname, 'template.html');
  const bundle = path.join(__dirname, 'project-dist', 'index.html');
  const componentsPath = path.join(__dirname, 'components');

  try {
    let template = await fsPromises.readFile(src, 'utf8');
    const components = await fsPromises.readdir(componentsPath);
    await fsPromises.writeFile(bundle, '');

    for (const component of components) {
      const pathToFile = path.join(componentsPath, component);
      const stats = await fsPromises.stat(pathToFile);

      if (stats.isFile() && path.extname(pathToFile) === '.html') {
        const componentName = path.basename(pathToFile).slice(0, -5);
        const regex = new RegExp(`{{\\s*${componentName}\\s*}}`, 'g');

        const component = await fsPromises.readFile(pathToFile, 'utf8');
        template = template.replace(regex, component);
        await fsPromises.writeFile(bundle, template);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
