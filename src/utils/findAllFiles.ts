import fs from 'fs';

export async function findAllFiles(path: string): Promise<string[]> {
  if (!path) return [];

  let folders: string[] = [path];
  let files: string[] = [];

  while (folders.length != 0) {
    let currentFolder = folders.pop();
    if (!currentFolder) return [];

    let childrens: string[] = fs.readdirSync(currentFolder);

    for await (let currentChildren of childrens) {
      let verify = await fs.statSync(currentFolder + '/' + currentChildren);
      if (verify.isFile()) {
        files.push(currentFolder + '/' + currentChildren);
      } else {
        folders.push(currentFolder + '/' + currentChildren);
      }
    }
  }
  return files;
}
