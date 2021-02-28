import React from "react";
import { Link } from "react-router-dom";
import img from "../img/404.svg";

function NotFound() {
  return (
    <div className="not-found">
      <div>
        <h2>Page Not Found </h2>
        <img src={img} alt="404 Not Found" />
        <Link className="button" to="/">
          Go back
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
