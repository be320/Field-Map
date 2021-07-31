import React from 'react'
import Dashboard from './Dashboard'
import MapUI from './MapUI'
import './Container.css'
import ZoomSlider from '../components/ZoomSlider'

const Container = () => {
    return(
        <div id="container-main">
        {/* <Dashboard /> */}
        <ZoomSlider />
        <MapUI />
        </div>
    )

}

export default Container