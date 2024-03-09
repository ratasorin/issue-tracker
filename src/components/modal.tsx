import { useCallback, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { HiMapPin, HiOutlinePencil } from "react-icons/hi2";

const Modal = () => {
  //   const [isEditing, setIsEditing] = useState<boolean>(false);

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

  return (
    <div className="z-20 fade-in-and-up absolute bottom-0 left-0 w-screen h-screen bg-black/60 flex flex-col justify-end">
      <div className="relative bg-white w-full px-6 py-6 flex flex-col">
        <div className="w-full flex flex-row items-center justify-center">
          <FaRegEdit className="mr-4 text-3xl" />{" "}
          <h4 className="text-2xl font-poppins font-medium">
            Formular sesizare
          </h4>
        </div>

        <div>
          <button
            onClick={() => {
              getUserCurrentPosition();
            }}
          >
            <HiMapPin />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
