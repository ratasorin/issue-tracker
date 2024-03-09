import { Map } from "ol";
import { useEffect, useState } from "react";

export const useGetClickCoordinates = (map: Map | null) => {
  const [coordinates, setCoordinates] = useState<number[]>([]);

  useEffect(() => {
    if (!map) return;
    map.on("click", (event) => {
      setCoordinates(
        map.getCoordinateFromPixelInternal(
          map.getEventPixel(event.originalEvent)
        )
      );
    });
  }, [map, setCoordinates]);
  return coordinates;
};
