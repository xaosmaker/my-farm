"use client";
import {
  MapContainer,
  Polygon,
  TileLayer,
  Marker,
  LayersControl,
} from "react-leaflet";
import { LatLngExpression, CRS } from "leaflet";
import proj4 from "proj4";

import "leaflet/dist/leaflet.css";
export default function Map() {
  proj4.defs(
    "EPSG:2100",
    "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs +type=crs",
  );

  const pol = [
    [380914.04, 4509964.46],
    [380892.43, 4509967.23],
    [380882.11, 4509993.33],
    [380893.45, 4509997.82],
    [380894.62, 4510006.38],
    [380896.07, 4510017.09],
    [380920.56, 4510013.77],
  ];
  const pol2 = pol.map((lan) => {
    const lan2 = proj4("EPSG:2100", "EPSG:4326", lan);
    return [lan2[1], lan2[0]];
  }) as LatLngExpression[];
  const lanlog = proj4("EPSG:2100", "EPSG:4326", [380914.04, 4509964.46]);
  // console.log(lanlog);
  // const lanlog = [2514870.489362123, 4973274.5391442785];
  console.log(pol2);

  return (
    <MapContainer center={[lanlog[1], lanlog[0]]} zoom={20} crs={CRS.EPSG3857}>
      <LayersControl></LayersControl>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polygon positions={pol2} color="red" />
      <Marker position={[lanlog[1], lanlog[0]]}>Hello</Marker>
    </MapContainer>
  );
}
