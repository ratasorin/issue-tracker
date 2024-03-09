import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  if (!params["lat"] || !params["long"])
    throw new Error("No input was provided for the conversion engine!");

  const googleGeolocationConverterEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${params["lat"]},${params["long"]}&key=${process.env.GOOGLE_GEOLOCATION_API_KEY}`;
  const response = await fetch(googleGeolocationConverterEndpoint);
  const body = await response.json();
  const result = body.results[0];
  return result;
};
