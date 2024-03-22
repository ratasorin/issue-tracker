import { useAtom } from "jotai";
import { selectedPredictionAtom } from "../location-modal/state";
import useCoordinatesFromPlaceId from "src/hooks/coordinates-from-place-id";
import { useEffect } from "react";
import { locationSuggestionAtom } from "~/routes/state";

const ConfirmLocationModal = () => {
  const [prediction] = useAtom(selectedPredictionAtom);
  const [, setLocationSuggestion] = useAtom(locationSuggestionAtom);
  const { place, refreshPlaceId } = useCoordinatesFromPlaceId();
  useEffect(() => {
    if (prediction) refreshPlaceId(prediction.place_id);
  }, [prediction]);

  useEffect(() => {
    if (place)
      setLocationSuggestion({
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      });
  }, [place]);

  return (
    <div className="absolute z-10 bottom-0 left-0 w-screen bg-white p-6 rounded-md">
      <p className="font-poppins font-semibold text-lg">
        {prediction?.description}
      </p>
    </div>
  );
};

export default ConfirmLocationModal;
