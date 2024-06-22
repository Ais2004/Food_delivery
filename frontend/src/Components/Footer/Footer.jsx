import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-left"> 
               <img src={assets.logo} alt=""/>
               <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsam nihil repellat debitis laudantium laboriosam, error doloribus asperiores possimus commodi, eligendi deserunt nesciunt modi minima. Vero assumenda quod sapiente qui!</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-right">
            <h2>GET IN TOUCH</h2>
                <ul>
                    <li>9133982004</li>
                    <li>contact@tomato.com</li>
                </ul>
            </div>
        </div>
        <hr/>
        <p className='footer-copyright'>Copyright   2024    @     ALL RIGHTS ARE RESERVED</p>
        </div>
  )
}

export default Footer