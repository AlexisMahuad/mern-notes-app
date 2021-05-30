import React from "react";
import { Link } from "react-router-dom";
import img from "../public/images/404.svg";

function NotFound() {
  return (
    <div className="container container-centered not-found">
      <img src={img} alt="404 Not Found" />
      <div className="note n-blue">
        <h2>Pagina no encontrada</h2>
        <Link className="button" to="/">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
