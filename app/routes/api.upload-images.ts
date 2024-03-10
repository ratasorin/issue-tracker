import type { ActionFunction } from "@remix-run/server-runtime";
import {
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
} from "@remix-run/server-runtime";
import { uploadImage } from "src/server/upload-image";

export const getFileExtension = (filename?: string) => {
  if (!filename) throw new Error("There was an error! The file has no name");

  const hasExtension = filename.includes(".");
  if (!hasExtension)
    throw new Error(
      "There was an error! One of the files didn't have any extension!"
    );

  const extension = filename.split(".").reverse()[0];
  if (extension === "")
    throw new Error(
      "The extension is undefined! Please add an extension after `.`"
    );

  return extension;
};

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ data, filename }) => {
      const extension = getFileExtension(filename);
      const key = await uploadImage(data, extension);

      return key;
    }
  );

  try {
    const form = await unstable_parseMultipartFormData(request, uploadHandler);
    const photo_ids = [...form.values()];
    return { photo_ids };
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
};
