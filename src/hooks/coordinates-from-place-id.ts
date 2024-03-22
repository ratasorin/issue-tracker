import debounce from "debounce";
import { useCallback, useState } from "react";
import { loader as coordinatesFromLocationLoader } from "~/routes/api.google-location-to-coordinates.$place_id";

type CoordinatesFromLocationResponse = Awaited<
  ReturnType<typeof coordinatesFromLocationLoader>
>;
const useCoordinatesFromPlaceId = () => {
  const [place, setPlace] = useState<CoordinatesFromLocationResponse | null>(
    null
  );
  const refreshPlaceId = useCallback(
    debounce((place_id: string) => {
      fetch(`/api/google-location-to-coordinates/${place_id}`)
        .then((r) => r.json())
        .then(setPlace);
    }, 500),
    [setPlace]
  );

  return { refreshPlaceId, place };
};

export default useCoordinatesFromPlaceId;
