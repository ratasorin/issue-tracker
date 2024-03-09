import { Map } from "ol";
import { shiftKeyOnly } from "ol/events/condition.js";
import ExtentInteraction from "ol/interaction/Extent.js";
import { useEffect, useMemo, useState } from "react";

export const useCreateBoundingBox = (map: Map | null) => {
  const extent = useMemo(
    () => new ExtentInteraction({ condition: shiftKeyOnly }),
    []
  );
  const [boundingBox, setBoundingBox] = useState<number[]>([]);
  extent.on("extentchanged", (eve) => {
    setBoundingBox(eve.extent);
  });

  useEffect(() => {
    if (!map) return;

    map.addInteraction(extent);
  }, [extent, map]);

  return boundingBox;
};
