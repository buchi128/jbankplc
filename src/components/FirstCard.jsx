import React from 'react'
import { Link } from 'react-router-dom'

const FirstCard = () => {
  return (
    <>
    <div id='hand-container'>
    <div className="card" style={{width:"18rem"}}>
  <div className="card-body">
    <h2 className="card-title" id='firstcards'>Online Banking Made Easy</h2>
    <h4 className="card-subtitle mb-2" id='firstcards'>Start Saving Today With Your Trusted Bank</h4>
    <p className="card-text">Enjoy the ease and speed of sending money to your family, friends or business partners both domestically and internationally.</p>
    <p>With our platform, money transfers are simpler and more effective.</p>
    <button className='bg-success text-light' id='fcardbtn'><Link className="nav-link text-light" to="/register">Open Account</Link></button>   
  </div>
</div> 
</div>
    </>
  )
}

export default FirstCard