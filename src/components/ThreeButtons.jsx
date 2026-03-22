import React from 'react'
import securityIcon from '../assets/icon-security-ssl-26.png'
import clockIcon from '../assets/icon-clock-24.png'
import speedIcon from '../assets/icons8-speed-file-64.png'

const ThreeButtons = () => {
  return (
    <>
   <div>
     <button id='btn' className='me-4' type='button' style={{backgroundColor:"#06478b", color:"white"}}><img src={securityIcon} alt="firstbtn" />Secure</button>
    <button id='btn'  className='me-4' type='button' style={{backgroundColor:"#06478b", color:"white"}}><img src={clockIcon} alt="secondbtn" />24/7<br/> Support</button>
    <button id='btn' className='me-4' type='button' style={{backgroundColor:"#06478b", color:"white"}}><img src={speedIcon} alt="thirdbtn" />Faster<br/> Transaction</button>
   </div>
    </>
  )
}

export default ThreeButtons