
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FirstCard from "../components/FirstCard";
import ThreeButton from "../components/ThreeButtons";


  const Home = () => {
  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }
}, [navigate]);

  return (
    <>
    
    <FirstCard />
    <ThreeButton />



    </>
  );
};


export default Home