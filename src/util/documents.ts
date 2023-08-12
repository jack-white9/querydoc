import fs from "fs";

export const readDocument = (path: string): string => {
  try {
    const documentText = fs.readFileSync(path);
    return documentText.toString();
  } catch (error) {
    console.log(`Error: ${error.stack}`);
    return "";
  }
};

export const chunkString = (string: string, length: number) => {
  return string.match(new RegExp(".{1," + length + "}", "g"));
};

export const readFilesInDirectory = (
  dir: string,
  files: string[] = []
): string[] => {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = createFilePath(dir, file);
    if (fs.statSync(name).isDirectory()) {
      // use recursion to read all files, regardless of depth
      readFilesInDirectory(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
};

const createFilePath = (dir: string, file: string): string => {
  if (dir.endsWith("/")) {
    return `${dir.slice(0, -1)}/${file}`;
  } else {
    return `${dir}/${file}`;
  }
};
