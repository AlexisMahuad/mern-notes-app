import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Components
import Navbar from "./components/Navbar/Navbar";
// Pages
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import PublicNotes from "./pages/PublicNotes";
import ValidateMail from "./pages/ValidateMail";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        {/* Routes */}
        <Route exact path="/">
          <PublicNotes />
        </Route>
        <Route exact path="/notes">
          <Notes />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/pending/:id">
          <ValidateMail />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
