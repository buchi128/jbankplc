import React from "react";
import { Link } from "react-router-dom";


const PageNotFound = ()=>{
    return(
        <>
       <div className="not-found-container">
      <h1 className="error-code">404</h1>
      <h2 className="error-message">Oops! Page Not Found</h2>
      <p className="error-description">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className="home-button">
        Go Back Home
      </Link>
    </div>
        </>
    )
}
export default PageNotFound