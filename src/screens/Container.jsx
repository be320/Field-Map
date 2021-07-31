import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import MapUI from './MapUI'
import './Container.css'
import ZoomSlider from '../components/ZoomSlider'

const Container = () => {

    const [mapWidth,setMapWidth] = useState('100%')
    const [boardWidth,setBoardWidth] = useState('0%')
    const [myMap,setMyMap] = useState('')
    const [regionSelected, setRegionSelected] = useState('')

    const changeZoom = (event, value) => {
        if(myMap !== '')
            myMap.setZoom(value)
    }

    const minimizeMap = () => {
        setMapWidth('30%')
        setBoardWidth('70%')
    }

    const maximizeMap = () => {
        setMapWidth('100%')
        setBoardWidth('0%')
        setTimeout(function(){ myMap.invalidateSize()}, 400);
        if(regionSelected !== '')
            console.log(regionSelected)
    }

    const handleMap = (value) =>{
        setMyMap(value)
    }

    const handleRegion = (value) => {
        setRegionSelected(value)
    }



    return(
        <div id="container-main">
{  (myMap !== '')  &&    <Dashboard boardWidth = {boardWidth} maximizeMap = {maximizeMap} regionSelected = {regionSelected} />}
        { (myMap !== '')  && <ZoomSlider changeZoom = {changeZoom} />}
        <MapUI handleMap = {handleMap} mapWidth = {mapWidth} minimizeMap = {minimizeMap} handleRegion = {handleRegion}  />
        </div>
    )

}

export default Container