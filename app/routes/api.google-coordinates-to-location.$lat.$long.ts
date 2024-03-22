import { Client } from "@googlemaps/google-maps-services-js";
import { LoaderFunctionArgs } from "@remix-run/node";

// const googleGeolocationConverterEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${params["lat"]},${params["long"]}&key=${process.env.GOOGLE_GEOLOCATION_API_KEY}`;
export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params["lat"] || !params["long"])
    throw new Error("No input was provided for the conversion engine!");

  const client = new Client({});

  const locationResponse = await client.reverseGeocode({
    params: {
      key: process.env.GOOGLE_GEOLOCATION_API_KEY || "",
      latlng: { latitude: Number(params.lat), longitude: Number(params.long) },
    },
  });

  const location = locationResponse.data.results[0];
  return location;
};
