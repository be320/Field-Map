import React from 'react'
import Dashboard from './Dashboard'
import MapUI from './MapUI'
import './Container.css'

const Container = () => {
    return(
        <div id="container-main">
        <Dashboard />
        <MapUI />
        </div>
    )

}

export default Container