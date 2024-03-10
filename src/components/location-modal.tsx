import debounce from "debounce";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { HiMapPin } from "react-icons/hi2";
import { animateRipple } from "src/animations/ripple-effect";
import { Position, locationAtom, pageAtom } from "./parent-modal";

interface Prediction {
  description: string;
  matched_substrings: { length: number; offset: number }[];
  place_id: string;
  reference: string;
}

const LocationModal = () => {
  const [, changePage] = useAtom(pageAtom);
  const [location, setLocation] = useAtom(locationAtom);

  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);

  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const getPredictedPlaceCoordinates = useCallback(
    debounce((prediction: Prediction) => {
      console.log({ prediction });
      fetch(`/api/google-location-to-coordinates/${prediction.place_id}`)
        .then((r) => r.json())
        .then((response) => {
          console.log(response);
          const latitude = response.lat;
          const longitude = response.lng;
          setLocation({ latitude, longitude });
          toast.success(
            `Locația: ${prediction.description} a fost aleasă cu succes!`
          );
        });
    }, 500),
    []
  );

  const getLocationFromCoordinates = useCallback(
    debounce((position: Position) => {
      fetch(
        `/api/google-coordinates-to-location/${position.latitude}/${position.longitude}`
      )
        .then((r) => r.json())
        .then((response) => {
          const formatted_address = response.formatted_address;
          console.log({ formatted_address });
          toast.success(
            `Locația: ${formatted_address} a fost aleasă cu succes!`,
            { duration: 5000 }
          );
        });
    }, 500),
    []
  );

  useEffect(() => {
    if (selectedPrediction != null)
      getPredictedPlaceCoordinates(selectedPrediction);
  }, [getPredictedPlaceCoordinates, selectedPrediction]);

  const getAutocompleteResult = debounce((input: string) => {
    console.log({ input });
    fetch(`/api/google-autocomplete/${input}`)
      .then((r) => r.json())
      .then((response) => {
        console.log(response.predictions);
        setPredictions(response.predictions);
      });
  }, 500);

  const getUserCurrentPosition = useCallback(() => {
    const position = new Promise<Position>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          resolve(pos.coords);
        },
        (err) => {
          console.log(err);
          reject();
        }
      );
    });

    return position;
  }, [setLocation]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Ask for permission
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted") {
            // Permission already granted
          } else if (result.state === "prompt") {
            // Permission not yet granted, ask the user
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
  }, []);

  return (
    <>
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
          onClick={async (event) => {
            animateRipple(event);
            const position = await getUserCurrentPosition();
            console.log({ position });
            if (!position) {
              toast.error(
                "Nu putem să identificăm locația! Vă rugăm încercați din nou!",
                { duration: 1000 }
              );
              return;
            }

            getLocationFromCoordinates(position);
          }}
        >
          FOLOSESTE LOCATIA CURENTA
          <HiMapPin className="text-red-500 text-2xl ml-2 mb-2" />
        </button>
      </div>
      <p className="font-poppins text-slate-500 text-sm mb-2"> sau </p>
      <div className="flex flex-col w-full mb-2">
        <label
          htmlFor="location"
          className="font-poppins text-slate-500 text-sm mb-2"
        >
          Introduceți adresa
        </label>
        <input
          onChange={(event) => {
            getAutocompleteResult(event.currentTarget.value);
          }}
          type="search"
          id="location"
          className="border-2 border-slate-300 px-4 py-2 rounded-md shadow-sm"
        />
      </div>
      <div className="max-h-56 overflow-auto mb-6">
        {!predictions.length
          ? null
          : predictions.map((prediction) => (
              <button
                className="overflow-hidden min-w-full relative bg-white text-slate-900 text-green uppercase hover:bg-slate-200 hover:shadow-sm hover:border-slate-500 flex flex-row items-center justify-center font-poppins font-semibold px-4 py-2 mb-2 border-slate-300 border-2 rounded-md shadow-sm text-center"
                key={prediction.place_id}
                style={
                  prediction.place_id === selectedPrediction?.place_id
                    ? { border: "2px solid rgb(34 197 94)" }
                    : {}
                }
                onClick={(event) => {
                  setSelectedPrediction(prediction);
                  animateRipple(event);
                }}
              >
                {prediction.description}
              </button>
            ))}
      </div>
      <div className="w-full flex flex-row-reverse">
        {location === null ? (
          <button
            disabled
            className="overflow-hidden relative bg-white text-slate-600 text-green uppercase flex flex-row items-center font-poppins font-semibold px-4 py-2 mb-2 border-slate-200 border-2 rounded-md shadow-sm text-center"
          >
            CONTINUĂ
          </button>
        ) : (
          <button
            onClick={() => {
              changePage(2);
            }}
            className="overflow-hidden relative bg-white text-green-900 text-green uppercase hover:bg-green-100 hover:shadow-sm hover:border-green-500 flex flex-row items-center font-poppins font-semibold px-4 py-2 mb-2 border-green-400 border-2 rounded-md shadow-sm text-center"
          >
            CONTINUĂ
          </button>
        )}
      </div>
    </>
  );
};

export default LocationModal;
