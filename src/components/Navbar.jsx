import React from 'react'
import { Link } from 'react-router-dom'
 
 const Navbar = () => {
   return (
     <>
  <nav className="navbar navbar-expand-lg bg-body-tertiary p-3" id='nav'>
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <a className="navbar-brand" href="#">J<span className='text-success'>BANK</span> PLC</a>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link text-dark" to="/" style={{fontWeight:"bold"}}>Home</Link> 
        </li>
        <li className="nav-item">
          <Link className="nav-link text-dark" to="/about"style={{fontWeight:"bold"}}>About</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-dark" to="/importantlinks" style={{fontWeight:"bold"}}>Important Links</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-dark" to="/resources" aria-disabled="true"style={{fontWeight:"bold"}}>Resources</Link>
        </li>
      </ul>
      <div className="d-flex me-2 gap-3">
       
<div className="dropdown">
  <a className="btn btn-outline-success dropdown-toggle" style={{fontWeight:"bold"}} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
     Login
  </a>

  <ul className="dropdown-menu">
    <li><Link className="nav-link dropdown-item" to="/login">Customer Login</Link></li> 
     <li><Link className="nav-link dropdown-item" to="/admin/login">Admin Login</Link></li> 
    <li><Link className="nav-link dropdown-item" to="/admin/seed-admin">Admin Signup</Link></li>
   
  </ul>
</div>

       <button className="btn btn-outline-success bg-dark text-light" type="submit"style={{fontWeight:"bold"}}>
        <Link className="nav-link text-light" to="/register">Open Account</Link></button>
      </div>
    </div>
  </div>
</nav>
     </>
   )
 }
 export default Navbar