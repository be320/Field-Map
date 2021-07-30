import React, { useEffect } from "react";
import "./MapUI.css";
import L from "leaflet";
import axios from "axios";
import geoJSON from "../data";
import * as turf from "@turf/turf";
import wms from "leaflet.wms";
var convert = require("xml-js");

const MapUI = () => {
  useEffect(() => {
    initMap();
  }, []);

  const initMap = async () => {
    var data = {};
    var layers = [];

    axios
      .get(
        "https://eos.com/landviewer/wms/7f609ae3-ffb8-4fd4-bdbc-7a295800990b?SERVICE=WMS&REQUEST=GetCapabilities"
      )
      .then(res => {
        data = convert.xml2json(res.data, { compact: true, spaces: 4 });
        data = JSON.parse(data);
        layers = data["WMS_Capabilities"]["Capability"]["Layer"];
        var regions = [];
        var name = "";
        var regionLayers = [];
        var regionBoundaries = {};
        var xCenter = 0
        var yCenter = 0
        var options = { units: "kilometers" };
        var from = 0
        var to = 0
        var distance = 0
        var days = []
        layers.map(layer => {
          if (layer.hasOwnProperty("Layer")) {
            days = []
            name = layer["Name"]["_text"];
            regionLayers = layer["Layer"];
            regionBoundaries = regionLayers[0]["BoundingBox"]["_attributes"];
            xCenter =
              (parseFloat(regionBoundaries["maxx"]) +
                parseFloat(regionBoundaries["minx"])) /
              2;
            yCenter =
              (parseFloat(regionBoundaries["maxy"]) +
                parseFloat(regionBoundaries["miny"])) /
              2;
            from = turf.point([
              parseFloat(regionBoundaries["maxy"]),
              39.984
            ]);
            to = turf.point([yCenter, 39.984]);
            distance = turf.distance(from, to, options);
            distance = distance *1000

            regionLayers.map((reg) => {
                days.push(reg["Name"]["_text"])
            })
            
            regions.push({
              name: name,
              xCenter: xCenter,
              yCenter: yCenter,
              radius: distance,
              days: days
            });
          }
        });

        console.log(regions)

        var map = L.map("mapid").setView([yCenter, xCenter], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1
        }).addTo(map);

        var from = turf.point([parseFloat(regionBoundaries["maxy"]), 39.984]);
        var to = turf.point([yCenter, 39.984]);
        var options = { units: "kilometers" };

        var distance = turf.distance(from, to, options);
        var area = L.circle([yCenter, xCenter], {
          radius: distance * 1000
        }).addTo(map);
        console.log(xCenter + " , " + yCenter);

        map.fitBounds(area.getBounds(), {
          padding: [20, 20]
        });
      });
  };

  return <div id="mapid"></div>;
};

export default MapUI;
