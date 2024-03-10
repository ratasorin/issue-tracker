import { Form } from "@remix-run/react";
import DragAndDrop, { UploadFile } from "./drag-and-drop/drag-and-drop";
import Preview from "./drag-and-drop/preview";
import { useState } from "react";
import { animateRipple } from "src/animations/ripple-effect";
import { useAtom } from "jotai";
import { locationAtom } from "./parent-modal";

const BuildingInformationModal = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [location] = useAtom(locationAtom);

  return (
    <div className="h-96 overflow-auto">
      <Form
        method="post"
        id="complaint-details"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const multipartForm = new FormData();

          files.forEach((file, index) =>
            multipartForm.append(`file-${index}`, file.source)
          );

          fetch("/api/upload-images", { method: "POST", body: multipartForm })
            .then((r) => r.json())
            .then((response) => {
              const ids: string[] = response.photo_ids;
              console.log({ ids });

              ids.forEach((photo_id, index) =>
                form.append(`photo-${index}`, photo_id)
              );

              return fetch("/api/upload-complaint", {
                method: "POST",
                body: form,
              }).then((r) => r.json());
            });
        }}
      >
        <div className="flex flex-col w-full mb-2">
          <label htmlFor="title" className="font-poppins text-sm mb-2">
            Oferiți un titlu sugestiv pentru problema dumneavoastră
          </label>
          <input
            id="title"
            name="title"
            className="border-2 border-slate-300 px-4 py-2 rounded-md shadow-sm w-10/12 mx-auto"
          />
        </div>
        <span className="mt-2 font-poppins text-sm">
          Te rugăm să ne oferi și o scurtă descriere a problemei
        </span>
        <div className="relative mt-2 p-2">
          <input
            id="latitude"
            name="latitude"
            type="hidden"
            value={location?.latitude}
          />

          <input
            id="longitude"
            name="longitude"
            type="hidden"
            value={location?.longitude}
          />

          <div className="flex flex-col">
            <div className="flex flex-row mb-6">
              <textarea
                rows={10}
                required
                name="description"
                id="description"
                className="w-full flex-1 rounded-lg border-4 border-zinc-300 p-4 font-mono text-sm leading-tight outline-none "
              />
            </div>

            <DragAndDrop files={files} setFiles={setFiles} />
            <Preview files={files} setFiles={setFiles} />

            <div className="mt-6 w-full flex flex-row items-center justify-around ">
              <button
                type="submit"
                className="overflow-hidden relative bg-white text-green-900 text-green uppercase hover:bg-green-200 hover:shadow-sm hover:greem-slate-500 flex flex-row items-center justify-center font-poppins font-semibold px-4 py-2 mb-2 border-green-300 border-2 rounded-md shadow-sm text-center"
                onClick={(event) => {
                  animateRipple(event);
                }}
              >
                Salvează
              </button>
              <button className="overflow-hidden relative bg-white text-red-900 text-green uppercase hover:bg-red-200 hover:shadow-sm hover:red-slate-500 flex flex-row items-center justify-center font-poppins font-semibold px-4 py-2 mb-2 border-red-300 border-2 rounded-md shadow-sm text-center">
                Anulează
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BuildingInformationModal;
