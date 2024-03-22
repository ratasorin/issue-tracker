import { Client } from "@googlemaps/google-maps-services-js";
import { LoaderFunctionArgs } from "@remix-run/node";

// const googleGeolocationConverterEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${params["place_id"]}&key=${process.env.GOOGLE_GEOLOCATION_API_KEY}`;
export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params["place_id"])
    throw new Error("No input was provided for the conversion engine!");

  const client = new Client({});

  const coordinatesResponse = await client.geocode({
    params: {
      key: process.env.GOOGLE_GEOLOCATION_API_KEY || "",
      place_id: params.place_id,
    },
  });

  const data = coordinatesResponse.data.results[0];
  return data;
};
