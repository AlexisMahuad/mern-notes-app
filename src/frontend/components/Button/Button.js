import React from "react";
import "./button.css";

function Button({ text, type = "button", action }) {
  return (
    <button type={type} className="button" onClick={(e) => action(e)}>
      {text}
    </button>
  );
}

export default Button;
