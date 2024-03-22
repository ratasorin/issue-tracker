import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { atom } from "jotai";

export const selectedPredictionAtom = atom<PlaceAutocompleteResult | null>(
  null
);
