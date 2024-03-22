import { IoCloseCircleOutline } from "react-icons/io5";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { complaintAtom } from "~/routes/state";

const ComplaintModal = () => {
  const [complaint, setComplaint] = useAtom(complaintAtom);
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    if (complaint) setModalOpen(true);
  }, [complaint, setModalOpen]);

  if (!complaint) return null;
  if (!modalOpen) return null;

  return (
    <div className="z-20 absolute bottom-0 left-0 w-screen h-screen bg-black/60 flex flex-col justify-end">
      <div className="relative fade-in-and-up bg-white w-full px-6 py-6 flex flex-col rounded-md items-center">
        <div className="w-full flex flex-row-reverse">
          <button
            className="text-3xl text-gray-500 mb-2"
            onClick={() => {
              setModalOpen(false);
              setComplaint(null);
            }}
          >
            <IoCloseCircleOutline />
          </button>
        </div>
        <div className="flex flex-col w-full items-center">
          <span className="text-xl font-poppins font-bold mb-4">
            {complaint.title}
          </span>
          <span className="w-full p-2 font-poppins italic">
            {complaint.description}
          </span>
          <div className="max-w-full flex flex-row flex-wrap items-center justify-center">
            {complaint.images.map((image) => (
              <img
                key={image}
                src={`/api/resource/${complaint.images}`}
                className="rounded-md"
                alt=""
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
