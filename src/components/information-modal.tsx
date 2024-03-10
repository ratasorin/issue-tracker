import { IoCloseCircleOutline } from "react-icons/io5";
import { useAtom } from "jotai";
import { complaintAtom } from "~/routes/_index";
import { useEffect, useState } from "react";

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
          {complaint.title}
          {complaint.description}
          <img src={`/api/resource/${complaint.images}`} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
