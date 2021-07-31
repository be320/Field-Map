import React from "react";
import "./ZoomSlider.css";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const ZoomSlider = props => {
  const useStyles = makeStyles({
    root: {
      width: 200
    }
  });

  const classes = useStyles();

  return (
    // slider component from Material UI
    <div id="zoom-slider-main">
      <div className={classes.root}>
        <Typography>Zoom</Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              defaultValue={6}
              onChange={props.changeZoom}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={6}
              max={13}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ZoomSlider;
