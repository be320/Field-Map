import React,{useState} from "react";
import "./ZoomSlider.css";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const ZoomSlider = () => {

    const [zoomLevel, setZoomLevel] = useState(6);

    const handleChange = (event, value) => {
        setZoomLevel(value)
        console.log(value)
      }
    const useStyles = makeStyles({
        root: {
          width: 200,
        },
      });

    const classes = useStyles();

  return (
    <div id="zoom-slider-main">
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        Zoom
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs>
        <Slider
        defaultValue={6}
        onChange = {handleChange}
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
