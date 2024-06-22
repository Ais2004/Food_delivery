import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
        <div className="app1" id="app1">
        <h1> For Better Experience Download <br/>Tomato App</h1>
        <div className="icons">
            <img src={assets.play_store} alt="" />
            <img src={assets.app_store} alt="" />
        </div>
        </div>
    
  )
}

export default AppDownload