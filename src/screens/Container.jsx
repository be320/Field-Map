import React, { useState } from "react";
import Dashboard from "./Dashboard";
import MapUI from "./MapUI";
import "./Container.css";
import ZoomSlider from "../components/ZoomSlider";

const Container = () => {
  // states of the container
  const [mapWidth, setMapWidth] = useState("100%"); // map width
  const [boardWidth, setBoardWidth] = useState("0%"); // board width
  const [myMap, setMyMap] = useState(""); // map viewed to the user
  const [regionSelected, setRegionSelected] = useState(""); // region selected by the user from the map

  // function that changes the zoom level of the map
  const changeZoom = (event, value) => {
    if (myMap !== "") myMap.setZoom(value);
  };

  // funcion that minimizes the map to view the dashboard
  const minimizeMap = () => {
    setMapWidth("30%");
    setBoardWidth("70%");
  };

  // function that maximizes the map to full screen and closes the dashboard
  const maximizeMap = () => {
    setMapWidth("100%");
    setBoardWidth("0%");
    setTimeout(function() {
      myMap.invalidateSize();
    }, 400);
    if (regionSelected !== "") console.log(regionSelected);
  };

  // handling the map state change
  const handleMap = value => {
    setMyMap(value);
  };

  // handling the region selected state change
  const handleRegion = value => {
    setRegionSelected(value);
  };

  return (
    <div id="container-main">
      {myMap !== "" && (
        <Dashboard
          boardWidth={boardWidth}
          maximizeMap={maximizeMap}
          regionSelected={regionSelected}
        />
      )}
      {myMap !== "" && <ZoomSlider changeZoom={changeZoom} />}
      <MapUI
        handleMap={handleMap}
        mapWidth={mapWidth}
        minimizeMap={minimizeMap}
        handleRegion={handleRegion}
      />
    </div>
  );
};

export default Container;
