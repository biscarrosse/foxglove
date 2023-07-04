"use client";
import { useState, useEffect, useMemo } from "react";

import Map, { Source, Layer } from "react-map-gl/maplibre";
// import type { CircleLayer } from "react-map-gl/maplibre";
// import type { FeatureCollection } from "geojson";
import { updatePercentiles } from "./utils";
import type { LayerProps } from "react-map-gl";

const dataLayer: LayerProps = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": {
      type: "interval",
      property: "percentile",
      stops: [
        [0, "#3288bd"],
        [1, "#66c2a5"],
        [2, "#abdda4"],
        [3, "#e6f598"],
        [4, "#ffffbf"],
        [5, "#fee08b"],
        [6, "#fdae61"],
        [7, "#f46d43"],
        [8, "#d53e4f"],
      ],
    },
    "fill-opacity": 0.4,
  },
};

export default function Home() {
  const [year, setYear] = useState(2015);
  const [allData, setAllData] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3,
    // longitude: -122.4,
    // latitude: 37.8,
    // zoom: 14,
  });

  useEffect(() => {
    /* global fetch */
    fetch(
      "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson"
    )
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data", err)); // eslint-disable-line
  }, []);

  // const geojson: FeatureCollection = {
  //   type: "FeatureCollection",
  //   features: [
  //     {
  //       type: "Feature",
  //       geometry: { type: "Point", coordinates: [-122.4, 37.8] },
  //       properties: null,
  //     },
  //   ],
  // };

  // const layerStyle: CircleLayer = {
  //   id: "point",
  //   type: "circle",
  //   source: "",
  //   paint: {
  //     "circle-radius": 10,
  //     "circle-color": "#007cbf",
  //   },
  // };

  const data = useMemo(() => {
    return (
      allData && updatePercentiles(allData, (f) => f.properties.income[year])
    );
  }, [allData, year]);

  return (
    <Map
      reuseMaps={true}
      initialViewState={viewState}
      style={{ width: 800, height: 600 }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER}`}
    >
      <Source id="my-data" type="geojson" data={data}>
        <Layer {...dataLayer} />
      </Source>
    </Map>
  );
}
