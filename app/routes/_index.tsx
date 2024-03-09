import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import { defaults as defaultControls } from "ol/control.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import Style from "ol/style/Style.js";
import Stroke from "ol/style/Stroke.js";
import Fill from "ol/style/Fill.js";
import { useState } from "react";
import { Outlet } from "@remix-run/react";
import Modal from "src/components/location-modal";
import { atom, useAtom } from "jotai";
import {
  TIMISOARA_BOUNDS,
  TIMISOARA_CENTER_X,
  TIMISOARA_CENTER_Y,
} from "src/constants";

const stroke = new Stroke({
  color: "rgb(0, 0, 0, 0.70)",
  width: 2,
});

const fill = new Fill({
  color: "rgb(0, 0, 0, 0.30)",
});

export const modalOpenAtom = atom(true);

export default function App() {
  const [map, setMap] = useState<Map | null>(null);
  const [modalOpen, setModalOpen] = useAtom(modalOpenAtom);
  return (
    <>
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
        </div>
      )}

      <Outlet />
    </>
  );
}
