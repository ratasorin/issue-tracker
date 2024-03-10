import { v4 as uuid } from "uuid";
import { writeFile } from "fs/promises";
import { join } from "path";

export const uploadImage = async (
  data: AsyncIterable<Uint8Array>,
  extension: string
) => {
  const key = `${uuid()}.${extension}`;
  const currentFolder = process.cwd();
  const fileDestination = join(currentFolder, "uploads", key);

  await writeFile(fileDestination, data, { flag: "w" });

  return key;
};
