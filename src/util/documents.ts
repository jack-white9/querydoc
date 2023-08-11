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
