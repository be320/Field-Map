import React, { useEffect } from "react";
import "./MapUI.css";
import L from "leaflet";
import axios from "axios";
import * as turf from "@turf/turf";
var convert = require("xml-js");

const MapUI = props => {
  useEffect(() => {
    initMap();
  }, []);

  const initMap = () => {
    var data = {};
    var layers = [];

    // Get Request on WMS API
    axios
      .get(
        "https://eos.com/landviewer/wms/7f609ae3-ffb8-4fd4-bdbc-7a295800990b?SERVICE=WMS&REQUEST=GetCapabilities"
      )
      .then(res => {
        data = convert.xml2json(res.data, { compact: true, spaces: 4 }); // convert xml data to json
        data = JSON.parse(data);
        layers = data["WMS_Capabilities"]["Capability"]["Layer"]; //extract all layers found in the data
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

        // loop on the layers
        layers.map(layer => {
          if (layer.hasOwnProperty("Layer")) {
            days = [];
            name = layer["Name"]["_text"]; // extract layer name
            regionLayers = layer["Layer"]; // extract layer days available
            regionBoundaries = regionLayers[0]["BoundingBox"]["_attributes"];  // extract layer bounds
            xCenter = (parseFloat(regionBoundaries["maxx"]) + parseFloat(regionBoundaries["minx"])) / 2; // layer xCenter
            yCenter = (parseFloat(regionBoundaries["maxy"]) + parseFloat(regionBoundaries["miny"])) / 2; // layer yCenter
            from = turf.point([parseFloat(regionBoundaries["maxy"]), 39.984]);
            to = turf.point([yCenter, 39.984]);
            distance = turf.distance(from, to, options); // calculating layer radius distance in kilometers
            distance = distance * 1000; // converting radius distance from kilometers to meters

            
            regionLayers.map(reg => {
              days.push(reg["Name"]["_text"]);
            });

            // group all the regions in regions array
            regions.push({
              name: name,
              xCenter: xCenter,
              yCenter: yCenter,
              radius: distance,
              days: days
            });
            days = [];
          }
        });

        var map = L.map("mapid"); // initiallizing Leaflet Map

        var latlngs = [
          [31.29732799140426, 34.2333984375],
          [31.89621446335144, 24.80712890625],
          [22.004174972902003, 24.98291015625],
          [22.004174972902003, 36.8701171875],
          [31.297327991404266, 34.2333984375]
        ];

        var features = turf.points(latlngs);

        var center = turf.center(features);

        map.setView(center["geometry"]["coordinates"], 13);

        var egypt = L.polygon(latlngs, { fillOpacity: 0 }).addTo(map);

        map.fitBounds(egypt.getBounds()); // adding egypt bounds to the map

        // Reading the map from openstreetmap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          minZoom: 6,
          maxZoom: 13,
          zoomControl: false,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1
        }).addTo(map);

        // adding the regions images from the sattelite on the map
        regions.map(region => {
          L.tileLayer
            .wms(
              "https://eos.com/landviewer/wms/7f609ae3-ffb8-4fd4-bdbc-7a295800990b",
              {
                transparent: true,
                layers: region["days"][0],
                format: "image/png",
                uppercase: true,
                version: "1.3.0"
              }
            )
            .addTo(map);

          // Adding circle to every region extracted from WMS on the map
          var circle = L.circle([region["yCenter"], region["xCenter"]], {
            radius: region["radius"],
            color: "white",
            fillOpacity: 0.3
          })
            .addTo(map)
            .on("click", function(e) {
              setTimeout(function() {
                map.invalidateSize();
              }, 400);
              props.minimizeMap();
              map.fitBounds(circle.getBounds(), {
                padding: [30, 30]
              });
              map.panTo(new L.LatLng(region["yCenter"], region["xCenter"]));
              props.handleRegion(region);
            })
            .bindPopup("<h1>" + region["name"] + "</h1>");
        });
        props.handleMap(map);
      });
  };

  return <div id="mapid" style={{ width: props.mapWidth }}></div>;
};

export default MapUI;
