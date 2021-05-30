import React from "react";
import "./alert.css";

function Alert({ type, msg, action }) {
  return (
    <>
      {msg && (
        <h4 className={`alert ${type}`}>
          {msg}
          <button
            onClick={(e) => {
              e.preventDefault();
              action(e);
            }}
          >
            X
          </button>
        </h4>
      )}
    </>
  );
}

export default Alert;
