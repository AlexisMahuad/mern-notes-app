import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import Axios from "axios";

// Contexts
import { useNotesContext } from "../contexts/notesContext";
import { useUserContext } from "../contexts/userContext";

// Components
import Note from "../components/Note/Note";
import Button from "../components/Button/Button";
import Alert from "../components/Alert/Alert";
import Loader from "../components/Loader";

// Hooks
import useNearScreen from "../hooks/useNearScreen";

function Notes() {
  const { userData, setUserData } = useUserContext();
  const {
    notes,
    setNotes,
    form,
    setForm,
    isEditing,
    setIsEditing,
    alert,
    setAlert,
    pickNoteColor,
    handleChangeNoteColor,
    handleSubmit,
    bottomReached,
    setBottomReached,
    loading,
    setLoading,
    from,
    setFrom,
  } = useNotesContext();
  const history = useHistory();

  // Get Notes
  // *********
  const getNotes = async (username) => {
    const fetchedNotes = (
      await Axios.get("/api/notes", {
        headers: {
          username,
          from,
        },
      })
    ).data;

    if (!notes) {
      setNotes(fetchedNotes);
    } else {
      setNotes(notes.concat(fetchedNotes));
    }

    if (fetchedNotes.length < 8) {
      setBottomReached(true);
    }

    setFrom(from + fetchedNotes.length);
    setLoading(false);
  };

  // Infinite Scroll
  // ***************
  const externalRef = useRef();
  const { isNearScreen } = useNearScreen({
    distance: "100px",
    externalRef: loading ? null : externalRef,
    once: false,
  });

  useEffect(() => {
    if (!bottomReached && isNearScreen) {
      setLoading(true);
      getNotes(userData.username);
    }
  }, [isNearScreen]);

  // Check if the user is already logged
  // ***********************************
  useEffect(async () => {
    const sessionToken = sessionStorage.getItem("auth-token");

    if (!sessionToken) {
      history.push("/");
    } else {
      if (!userData.token || !userData.username) {
        const tokenRes = await Axios.post("/auth/tokenIsValid", null, {
          headers: { "x-auth-token": sessionToken },
        });

        if (tokenRes.data) {
          const userRes = await Axios.get("/auth/", {
            headers: {
              "x-auth-token": sessionToken,
            },
          });

          setUserData({
            token: userRes.data.token,
            username: userRes.data.username,
          });

          if (!bottomReached) getNotes(userRes.data.username);
          return;
          // If the token is invalid
        } else {
          sessionStorage.setItem("auth-token", "");
          return history.push("/");
        }
      }
      if (!bottomReached) {
        getNotes(userData.username);
      }
    }
  }, []);

  //
  return (
    <>
      <section className="form-section">
        <div className="form-section-container">
          <form className={`note notes-form ${pickNoteColor()}`}>
            {/* If is editing */}
            {isEditing[0] && (
              <div className="form-header">
                <h2>
                  Edita la nota
                  <span onClick={() => handleChangeNoteColor()}>👇</span>
                </h2>
                <button
                  onClick={() => {
                    setForm({
                      title: "",
                      text: "",
                      color: "yellow",
                      public: false,
                    });
                    setIsEditing([false, ""]);
                  }}
                >
                  X
                </button>
              </div>
            )}
            {/* If isn't editing */}
            {!isEditing[0] && (
              <h2>
                Crea una nueva nota
                <span onClick={() => handleChangeNoteColor()}>👇</span>
              </h2>
            )}

            {/* Show alerts */}
            <Alert
              type={alert.type}
              msg={alert.message}
              action={() => setAlert({ type: null, message: "" })}
            />

            {/* Inputs */}
            <input
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Inserta un título"
            />
            <div className="form-control">
              <textarea
                maxLength="120"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Escribe lo que quieras..."
              />
            </div>
            <div className="checkbox">
              <label htmlFor="public">Público</label>
              <input
                type="checkbox"
                checked={form.public}
                onChange={() => setForm({ ...form, public: !form.public })}
                name="public"
                id="public"
              />
            </div>

            {/* Submit form */}
            <Button
              text={!isEditing[0] ? "Crear" : "Editar"}
              action={() => {
                handleSubmit(form, userData.username);
              }}
            />
          </form>

          {/* Info section */}
          <div className="notes-info">
            <h2>Organiza tus ideas con simples notas de colores</h2>
            <ul>
              <li>
                Si habilitas la opcion de "público" en la nota todo el mundo
                podrá encontrarla en la{" "}
                <Link to="/">sección de notas públicas</Link>
              </li>
              <li>
                Elige el color que más te guste clickeando el icono "👇" que se
                encuentra en la parte superior del formulario
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* User Notes */}
      <section className="notes-section" style={{ background: "#f7f7f7" }}>
        <h2>Mis Notas</h2>

        {/* If there aren't notes */}
        {(!notes || notes.length === 0) && (
          <h2
            style={{ maxWidth: "300px", fontSize: "1.25rem", margin: "auto" }}
          >
            No tienes ninguna nota en este momento, crea una! :D
          </h2>
        )}

        <ul>
          {/* If there are notes */}
          {notes &&
            notes.map((note) => (
              <Note
                key={note._id}
                public={false}
                content={{
                  ...note,
                }}
              />
            ))}
        </ul>

        {/* Bottom Reached Message */}
        {bottomReached && notes.length != 0 && (
          <h2 style={{ marginTop: "40px" }}>Has llegado al final</h2>
        )}

        {/* Loader */}
        {loading && <Loader />}

        {/* End reference (infinite scroll)*/}
        <div ref={externalRef}></div>
      </section>
    </>
  );
}

export default withRouter(Notes);
