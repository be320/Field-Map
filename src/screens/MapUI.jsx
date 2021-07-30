import React, { useEffect } from "react";
import "./MapUI.css";
import L from "leaflet";
import axios from "axios";
import geoJSON from "../data";
import * as turf from "@turf/turf";
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
        var xCenter = 0;
        var yCenter = 0;
        var options = { units: "kilometers" };
        var from = 0;
        var to = 0;
        var distance = 0;
        var days = [];
        layers.map(layer => {
          if (layer.hasOwnProperty("Layer")) {
            days = [];
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
            from = turf.point([parseFloat(regionBoundaries["maxy"]), 39.984]);
            to = turf.point([yCenter, 39.984]);
            distance = turf.distance(from, to, options);
            distance = distance * 1000;

            regionLayers.map(reg => {
              days.push(reg["Name"]["_text"]);
            });

            regions.push({
              name: name,
              xCenter: xCenter,
              yCenter: yCenter,
              radius: distance,
              days: days
            });
          }
        });

        console.log(regions);

        var map = L.map("mapid");
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1
        }).addTo(map);

        map.setView([regions[0]["yCenter"], regions[0]["xCenter"]], 13);

        // var area = L.circle([regions[0]["yCenter"], regions[0]["xCenter"]], {
        //   radius: regions[0]["radius"]
        // }).addTo(map);

        regions.map(region => {
            L.tileLayer
            .wms("https://eos.com/landviewer/wms/7f609ae3-ffb8-4fd4-bdbc-7a295800990b", {
              transparent: true,
              layers: region["days"][0],
              format: "image/png",
              uppercase: true,
              version: "1.3.0"
            })
            .addTo(map);
            
          });

        var latlngs = [
          [31.29732799140426, 34.2333984375],
          [31.89621446335144, 24.80712890625],
          [22.004174972902003, 24.98291015625],
          [22.004174972902003, 36.8701171875],
          [31.297327991404266, 34.2333984375]
        ];

        var egypt = L.polygon(latlngs, { "fillOpacity": 0 }).addTo(map);

        map.fitBounds(egypt.getBounds(), {
          padding: [10, 10]
        });
      });
  };

  return <div id="mapid"></div>;
};

export default MapUI;
