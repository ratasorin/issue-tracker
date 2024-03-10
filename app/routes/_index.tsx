import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import { defaults as defaultControls } from "ol/control.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import Style from "ol/style/Style.js";
import CircleStyle from "ol/style/Circle.js";
import Stroke from "ol/style/Stroke.js";
import Fill from "ol/style/Fill.js";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import Modal, { Position } from "src/components/parent-modal";
import { atom, useAtom } from "jotai";
import {
  TIMISOARA_BOUNDS,
  TIMISOARA_CENTER_X,
  TIMISOARA_CENTER_Y,
} from "src/constants";
import { database } from "database/connect";
import { Point } from "ol/geom.js";
import { Feature } from "ol";
import { transform } from "ol/proj.js";
import ComplaintModal from "src/components/information-modal";

export interface Complaint {
  complaint_id: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
}

export type ComplaintWithImage = Complaint & { images: string[] };

export interface ComplaintImages {
  complaint_id: string;
  images: string[];
}

const stroke = new Stroke({
  color: "rgb(0, 0, 0, 0.70)",
  width: 2,
});

const fill = new Fill({
  color: "rgb(0, 0, 0, 0.30)",
});

export const loader = async () => {
  await database.connect();

  const complaints_query = await database.query(
    "SELECT complaint_id, title, description, latitude, longitude FROM complaints LEFT JOIN images ON complaints.id = images.complaint_id;"
  );

  const complaints_images_query = await database.query(
    "SELECT complaint_id, array_agg(images.image_url) AS images FROM complaints LEFT JOIN images ON complaints.id = images.complaint_id GROUP BY images.complaint_id;"
  );

  const complaints: Complaint[] = complaints_query.rows;
  const complaints_images: ComplaintImages[] = complaints_images_query.rows;

  return { complaints, complaints_images };
};

export const modalOpenAtom = atom(false);
export const complaintAtom = atom<ComplaintWithImage | null>(null);

export default function App() {
  const [map, setMap] = useState<Map | null>(null);
  const [modalOpen, setModalOpen] = useAtom(modalOpenAtom);
  const [complaint, setComplaint] = useAtom(complaintAtom);
  const { complaints, complaints_images } = useLoaderData<typeof loader>();

  const [coordinates, setCoordinates] = useState<Position | null>(null);

  useEffect(() => {
    if (!coordinates) return;

    const complaint = complaints.find(
      (complaint) =>
        Math.abs(Number(complaint.latitude) - coordinates.latitude) <
          0.0000001 &&
        Math.abs(Number(complaint.longitude) - coordinates.longitude) < 0.000001
    );

    if (!complaint) return;

    const images = complaints_images.find(
      (c) => c.complaint_id === complaint.complaint_id
    )?.images;

    if (!images) return;

    setComplaint({ ...complaint, images });
  }, [complaints, complaints_images, coordinates, setComplaint]);

  const features = useMemo(
    () =>
      complaints.map((complaint) => {
        console.log(
          transform(
            [Number(complaint.longitude), Number(complaint.latitude)],
            "EPSG:4326",
            "EPSG:3857"
          )
        );
        const feature = new Feature(
          new Point(
            transform(
              [Number(complaint.longitude), Number(complaint.latitude)],
              "EPSG:4326",
              "EPSG:3857"
            )
          )
        );

        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({ color: "rgb(255, 0, 0)" }),
              stroke,
            }),
          })
        );

        return feature;
      }),
    [complaints]
  );

  useEffect(() => {
    if (!map) return;
    map.on("click", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });

      if (!feature) return;

      // @ts-expect-error bad typings by open layers
      const coordinatesWebMercator = feature.getGeometry()?.flatCoordinates;

      const latLongCoordinates = transform(
        [coordinatesWebMercator[0], coordinatesWebMercator[1]],
        "EPSG:3857",
        "EPSG:4326"
      );

      console.log({ latLongCoordinates });
      setCoordinates({
        latitude: latLongCoordinates[1],
        longitude: latLongCoordinates[0],
      });
    });
  }, [map]);

  return (
    <>
      {complaint && <ComplaintModal />}
      {modalOpen && <Modal />}
      <div
        id="map"
        className="absolute top-0 left-0 w-screen h-screen z-0"
        ref={(ref) => {
          if (!map && ref)
            setMap(
              new Map({
                layers: [
                  new TileLayer({ source: new OSM() }),
                  new VectorLayer({
                    source: new VectorSource({ features }),
                  }),
                  new VectorLayer({
                    style: new Style({
                      fill,
                      stroke,
                    }),
                    source: new VectorSource({
                      url: "/outline_map.json",
                      format: new GeoJSON(),
                    }),
                  }),
                ],
                view: new View({
                  extent: TIMISOARA_BOUNDS,
                  center: [TIMISOARA_CENTER_X, TIMISOARA_CENTER_Y],
                  zoom: 10,
                }),

                controls: defaultControls({
                  attribution: false,
                  rotate: false,
                  zoom: false,
                }),
                target: "map",
              })
            );
        }}
      ></div>
      {!modalOpen && (
        <div className="fade-in-and-up absolute bottom-10 flex flex-row justify-center w-full">
          {!complaint && (
            <button
              onClick={(event) => {
                const button = event.currentTarget;
                button.classList.add("fade-out-and-down");

                setTimeout(
                  () => {
                    console.log({ button });
                    if (!button) return;

                    setModalOpen(true);
                  },
                  // see tailwind.css for duration of ripple animation
                  250
                );
              }}
              className="overflow-hidden relative font-poppins font-bold bg-white text-slate-900 px-4 py-2 uppercase rounded-md border-2 border-slate-300 shadow-md hover:bg-slate-200 hover:shadow-sm hover:border-slate-500"
            >
              Înregistrați o sesizare
            </button>
          )}
        </div>
      )}

      <Outlet />
    </>
  );
}
