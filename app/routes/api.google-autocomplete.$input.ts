import { Client } from "@googlemaps/google-maps-services-js";
import { LoaderFunctionArgs } from "@remix-run/node";
import { TIMISOARA_LAT, TIMISOARA_LONG } from "src/constants";
const SEARCH_RADIUS_METERS = 5000; // 5km radius

// const googleAutocompleteEndpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${params["input"]}&location=${TIMISOARA_LAT},${TIMISOARA_LONG}&radius=${SEARCH_RADIUS_METERS}&strictbounds=true&fields=place_id,description&key=${process.env.GOOGLE_PLACES_API_KEY}`;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log({ TIMISOARA_LAT, TIMISOARA_LONG });
  if (!params["input"])
    throw new Error("No input was provided for the autocomplete engine!");

  const client = new Client({});

  const predictionsResponse = await client.placeAutocomplete({
    params: {
      strictbounds: true,
      input: params.input,
      key: process.env.GOOGLE_PLACES_API_KEY || "",
      radius: SEARCH_RADIUS_METERS,
      location: { latitude: TIMISOARA_LAT, longitude: TIMISOARA_LONG },
    },
  });

  return predictionsResponse.data.predictions;
};
