import React from "react";

function FormControl({ value, forHTML, type, label, action }) {
  return (
    <div className="form-control">
      <label htmlFor={forHTML}>{label}</label>
      <input
        onChange={(e) => action(e)}
        value={value}
        type={type}
        id={forHTML}
        name={forHTML}
      />
    </div>
  );
}

export default FormControl;
