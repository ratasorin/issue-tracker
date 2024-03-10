import { ActionFunctionArgs } from "@remix-run/node";
import { database } from "database/connect";

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

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const latitude = form.get("latitude");
  const longitude = form.get("longitude");
  const title = form.get("title");
  const complaintDescription = form.get("description");

  form.delete("latitude");
  form.delete("title");
  form.delete("longitude");
  form.delete("description");
  form.delete("bgfile");

  const photoIds = [...form.values()];

  await database.connect();

  const insert_complaint = await database.query(
    "INSERT INTO complaints VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id;",
    [title, complaintDescription, latitude, longitude]
  );

  const complaint_id = insert_complaint.rows[0].id;

  const images_id = [];
  for await (const photoId of photoIds) {
    const insert_image = await database.query(
      "INSERT INTO images VALUES(DEFAULT, $1, $2) RETURNING id;",
      [complaint_id, photoId]
    );
    const image_id = insert_image.rows[0].id;
    images_id.push(image_id);
  }

  console.log({
    latitude,
    longitude,
    complaintDescription,
    photoIds,
  });

  return { latitude, longitude, complaintDescription, title, images_id };
}
