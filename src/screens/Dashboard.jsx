import React from "react";
import "./Dashboard.css";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

const Dashboard = props => {
  return (
    <div id="dash-main" style={{ width: props.boardWidth }}>
      <div id="dash-haed">
        <h1 style={{ color: "#547445" }}>Platform Map</h1>
        <IconButton
          color="primary"
          aria-label="close"
          onClick={props.maximizeMap}
        >
          <CancelIcon />
        </IconButton>
      </div>
      <div id="dash-first">
        <div id="dash-info">
          <div className="dash-details">Name: {props.regionSelected.name}</div>
          <div className="dash-details">
            xCenter: {props.regionSelected.xCenter}
          </div>{" "}
          <div className="dash-details">
            yCenter: {props.regionSelected.yCenter}
          </div>{" "}
          <div className="dash-details">
            radius: {props.regionSelected.radius}
          </div>{" "}
          <div className="dash-details">days:</div>
          {props.regionSelected.days &&
            props.regionSelected.days.map(day => (
              <div className="dash-details">{day}</div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
