import React from "react";
import Hero from "../Components/Hero";
import Navbar from "../Components/Navbar";

const index = () => {
  return (
    <div
    // style = {{
    //   backgroundImage: 'url("/grid0.svg")', // Note: direct path to the image
    //   height: "100%",
    //   width: "100%",
    //   backgroundRepeat: "repeat",
    //   backgroundSize: "cover",
    // }}
    >
      <Navbar />
      <Hero />
    </div>
  );
};

export default index;
