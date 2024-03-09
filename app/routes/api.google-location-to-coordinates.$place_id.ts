import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  if (!params["place_id"])
    throw new Error("No input was provided for the conversion engine!");

  const googleGeolocationConverterEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${params["place_id"]}&key=${process.env.GOOGLE_GEOLOCATION_API_KEY}`;
  const response = await fetch(googleGeolocationConverterEndpoint);
  const body = await response.json();

  console.log({ body });
  const location = body.results[0].geometry.location;
  return location;
};
