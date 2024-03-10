import LocationModal from "./location-modal";
import { IoCloseCircleOutline } from "react-icons/io5";
import DetailsModal from "./details-modal";
import { atom, useAtom } from "jotai";
import { modalOpenAtom } from "~/routes/_index";

export interface Position {
  longitude: number;
  latitude: number;
}
export const locationAtom = atom<Position | null>(null);
export const pageAtom = atom<number>(1);

const ParentModal = () => {
  const [location] = useAtom(locationAtom);
  const [, setModalOpen] = useAtom(modalOpenAtom);
  const [page, setPage] = useAtom(pageAtom);
  return (
    <div className="z-20 absolute bottom-0 left-0 w-screen h-screen bg-black/60 flex flex-col justify-end">
      <div className="relative fade-in-and-up bg-white w-full px-6 py-6 flex flex-col rounded-md items-center">
        <div className="w-full flex flex-row-reverse">
          <button
            className="text-3xl text-gray-500 mb-2"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            <IoCloseCircleOutline />
          </button>
        </div>
        {page === 1 ? <LocationModal /> : null}
        {page === 2 ? <DetailsModal /> : null}

        <div className="mt-3 flex flex-row w-1/2 justify-around">
          <button
            onClick={() => {
              setPage(1);
            }}
            style={page === 1 ? { border: "2px solid black" } : {}}
            className="hover:bg-slate-200 hover:shadow-sm hover:border-slate-500 rounded-full w-10 h-10 overflow-hidden relative bg-white text-slate-600 text-green uppercase flex flex-row items-center justify-center font-poppins font-semibold px-4 py-2 mb-2 border-slate-200 border-2 shadow-sm text-center"
          >
            1
          </button>
          <button
            disabled={!location}
            onClick={() => {
              setPage(2);
            }}
            style={page === 2 ? { border: "2px solid black" } : {}}
            className={
              location
                ? "hover:bg-slate-200 hover:shadow-sm hover:border-slate-500 rounded-full w-10 h-10 overflow-hidden relative bg-white text-slate-600 text-green uppercase flex flex-row items-center justify-center font-poppins font-semibold px-4 py-2 mb-2 border-slate-200 border-2 shadow-sm text-center"
                : "rounded-full w-10 h-10 overflow-hidden relative bg-white text-slate-600 text-green uppercase flex flex-row items-center justify-center font-poppins font-semibold px-4 py-2 mb-2 border-slate-200 border-2 shadow-sm text-center"
            }
          >
            2
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentModal;
