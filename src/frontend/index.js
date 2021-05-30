import React from "react";
import ReactDOM from "react-dom";
import "core-js";
import "regenerator-runtime/runtime";

// Contexts
import { UserProvider } from "./contexts/userContext";
import { NotesProvider } from "./contexts/notesContext";

import App from "./App";

// Css
// import all css files inside ./css
// import "./public/css/index.css";
// import "./public/css/form.css";
require
  .context("./public/css", false, /\.css/)
  .keys()
  .map((url) => {
    require(`./public/css/${url.slice(2)}`);
  });

function Index() {
  return (
    <UserProvider>
      <NotesProvider>
        <App />
      </NotesProvider>
    </UserProvider>
  );
}

ReactDOM.render(<Index />, document.getElementById("root"));
