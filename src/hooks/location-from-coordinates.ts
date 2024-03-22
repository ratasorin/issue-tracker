import debounce from "debounce";
import { useCallback, useState } from "react";
import { Position } from "src/components/parent-modal/state";
import { loader as locationFromCoordinatesLoader } from "~/routes/api.google-coordinates-to-location.$lat.$long";

type CoordinatesToLocationResponse = Awaited<
  ReturnType<typeof locationFromCoordinatesLoader>
>;

export const useLocationFromCoordinates = () => {
  const [locationFromCoordinates, setLocationFromCoordinates] =
    useState<CoordinatesToLocationResponse | null>(null);
  const refreshCoordinates = useCallback(
    debounce((position: Position) => {
      fetch(
        `/api/google-coordinates-to-location/${position.latitude}/${position.longitude}`
      )
        .then((r) => r.json())
        .then(setLocationFromCoordinates);
    }, 500),
    []
  );

  return { refreshCoordinates, locationFromCoordinates };
};
