import React from "react";
import ReactDOM from "react-dom";
import "core-js";
import "regenerator-runtime/runtime";
// Contexts
import { UserProvider } from "./contexts/userContext";
import { NotesProvider } from "./contexts/notesContext";

import App from "./App";
import "./index.css";

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
