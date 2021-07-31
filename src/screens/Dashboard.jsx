import React from 'react'
import './Dashboard.css'

const Dashboard = (props) => {


    return(
        <div id="dashboard-main">
            <button onClick={props.maximizeMap} >Close</button>
        </div>
    )

}

export default Dashboard