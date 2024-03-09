import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { HiMapPin } from "react-icons/hi2";
import { IoCloseCircleOutline } from "react-icons/io5";
import { animateRipple } from "src/animations/ripple-effect";
import { modalOpenAtom } from "~/routes/_index";

const Modal = () => {
  //   const [isEditing, setIsEditing] = useState<boolean>(false);
  const [_, setModalOpen] = useAtom(modalOpenAtom);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const getUserCurrentPosition = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log({ position });
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
    (err) => console.log(err);
  }, [setLocation]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Ask for permission
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted") {
            // Permission already granted
            getUserCurrentPosition();
          } else if (result.state === "prompt") {
            // Permission not yet granted, ask the user
            getUserCurrentPosition();
          } else if (result.state === "denied") {
            // Permission denied, handle accordingly
            toast.error("Location access denied by the user!", {
              duration: 1000,
            });
          }
        })
        .catch((error) => {
          // Handle error
          console.error("Error checking location permission:", error);
        });
    } else {
      // Geolocation is not supported
      toast.error("Geolocation is not supported by this browser!", {
        duration: 1000,
      });
    }
  }, [getUserCurrentPosition]);

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
        <div className="w-full flex flex-row items-center justify-center mb-6">
          <FaRegEdit className="mr-4 text-3xl" />{" "}
          <h4 className="text-2xl font-poppins font-semibold">
            Formular sesizare
          </h4>
        </div>

        <div className="w-full mb-2">
          <p className="font-poppins text-slate-500 text-sm">Unde te aflii?</p>
        </div>
        <div>
          <button
            className="overflow-hidden relative bg-white text-slate-900 uppercase hover:bg-slate-200 hover:shadow-sm hover:border-slate-500 flex flex-row items-center font-poppins font-semibold px-4 py-2 mb-2 border-slate-300 border-2 rounded-md shadow-sm"
            onClick={(event) => {
              animateRipple(event);
              getUserCurrentPosition();
            }}
          >
            FOLOSESTE LOCATIA CURENTA
            <HiMapPin className="text-red-500 text-2xl ml-2 mb-2" />
          </button>
        </div>
        <p className="font-poppins text-slate-500 text-sm mb-2"> sau </p>
        <div className="flex flex-col w-full">
          <label
            htmlFor="location"
            className="font-poppins text-slate-500 text-sm mb-2"
          >
            Introduceți adresa
          </label>
          <input
            type="search"
            id="location"
            className="border-2 border-slate-300 px-4 py-2 rounded-md shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
