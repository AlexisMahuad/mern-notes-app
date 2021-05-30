import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

// Contexts
import { useUserContext } from "../../contexts/userContext";
import { useNotesContext } from "../../contexts/notesContext";

function Navbar() {
  const { userData, setUserData } = useUserContext();
  const { setNotes, setBottomReached, setFrom, setLoading } = useNotesContext();
  // Location
  const location = useLocation();

  function handleLogout() {
    setNotes(null);
    setBottomReached(false);
    setFrom(0);
    setLoading(true);

    setUserData({
      token: undefined,
      username: undefined,
    });
    sessionStorage.setItem("auth-token", "");
  }

  return (
    <nav>
      <div className="nav-center">
        <div className="nav-header">
          <h1>NotesApp</h1>
          <div className="movile-nav">
            {userData.username && location.pathname === "/" ? (
              <Link to="/notes">Mis Notas</Link>
            ) : (
              <Link to="/">Notas Publicas</Link>
            )}
          </div>
        </div>
        <div className="nav-links">
          {/* If the user is not logged */}
          {!userData.token && (
            <>
              <Link className="button" to="/register">
                Register
              </Link>
              <Link className="button" to="/login">
                Login
              </Link>
            </>
          )}
          {/* If the user is logged */}
          {userData.token && (
            <>
              <Link className="button" onClick={() => handleLogout()} to="/">
                Cerrar Sesion
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
