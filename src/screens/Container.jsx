import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import MapUI from './MapUI'
import './Container.css'
import ZoomSlider from '../components/ZoomSlider'

const Container = () => {

    const [mapWidth,setMapWidth] = useState('30%')
    const [boardWidth,setBoardWidth] = useState('70%')
    const [myMap,setMyMap] = useState('')

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
    }

    const handleMap = (value) =>{
        setMyMap(value)
    }

    return(
        <div id="container-main">
        <Dashboard boardWidth = {boardWidth} maximizeMap = {maximizeMap} />
        <ZoomSlider changeZoom = {changeZoom} />
        <MapUI handleMap = {handleMap} mapWidth = {mapWidth} minimizeMap = {minimizeMap} />
        </div>
    )

}

export default Container