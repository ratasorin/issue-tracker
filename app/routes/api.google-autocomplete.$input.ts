import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { TIMISOARA_LAT, TIMISOARA_LONG } from "src/constants";

const SEARCH_RADIUS_METERS = 10000; // 20km radius

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  console.log({ TIMISOARA_LAT, TIMISOARA_LONG });
  if (!params["input"])
    throw new Error("No input was provided for the autocomplete engine!");

  const googleAutocompleteEndpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${params["input"]}&location=${TIMISOARA_LAT},${TIMISOARA_LONG}&radius=${SEARCH_RADIUS_METERS}&strictbounds=true&fields=place_id,description&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  const response = await fetch(googleAutocompleteEndpoint);
  return response;
};
