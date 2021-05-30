import React from "react";
import img from "../public/images/loader.svg";

function Loader({ show = true }) {
  return show && <img src={img} className="loader" alt="Loader" />;
}

export default Loader;
