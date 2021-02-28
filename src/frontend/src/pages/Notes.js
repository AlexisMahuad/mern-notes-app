import React, { useEffect } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
// Contexts
import { useNotesContext } from "../contexts/notesContext";
import { useUserContext } from "../contexts/userContext";
// Components
import Note from "../components/Note";
import Axios from "axios";

function Notes() {
  // Context
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
  } = useNotesContext();

  // history
  const history = useHistory();

  const getNotes = async (username) => {
    const res = await Axios.get("/api/notes", {
      headers: {
        username,
      },
    });
    // const res = await Axios.get("http://localhost:4000/api/notes", {
    //   headers: {
    //     username,
    //   },
    // });
    setNotes(res.data);
  };

  useEffect(async () => {
    const sessionToken = sessionStorage.getItem("auth-token");

    if (!sessionToken) {
      history.push("/");
    } else {
      if (!userData.token || !userData.username) {
        // const tokenRes = await Axios.post(
        //   "http://localhost:4000/auth/tokenIsValid",
        //   null,
        //   {
        //     headers: { "x-auth-token": sessionToken },
        //   }
        // );
        const tokenRes = await Axios.post("/auth/tokenIsValid", null, {
          headers: { "x-auth-token": sessionToken },
        });

        if (tokenRes.data) {
          // const userRes = await Axios.get("http://localhost:4000/auth/", {
          //   headers: {
          //     "x-auth-token": sessionToken,
          //   },
          // });
          const userRes = await Axios.get("/auth/", {
            headers: {
              "x-auth-token": sessionToken,
            },
          });

          setUserData({
            token: userRes.data.token,
            username: userRes.data.username,
          });
          return getNotes(userRes.data.username);

          // If the token is invalid
        } else {
          sessionStorage.setItem("auth-token", "");
          return history.push("/");
        }
      }
      getNotes(userData.username);
    }
  }, []);

  return (
    <>
      <section className="form-section">
        <div className="form-section-container">
          <form
            action="/"
            method="POST"
            className={`note notes-form ${pickNoteColor()}`}
          >
            {/* If is editing */}
            {isEditing[0] && (
              <div className="form-header">
                <h2>
                  Edita la nota
                  <span onClick={() => handleChangeNoteColor()}>👇</span>
                </h2>
                <button
                  onClick={(e) => {
                    setForm({ title: "", author: "", text: "" });
                    setIsEditing([false, null]);
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
            {alert.message && (
              <>
                <h4 className={`alert ${alert.type}`}>
                  {alert.message}
                  <button onClick={() => setAlert({ type: null, message: "" })}>
                    X
                  </button>
                </h4>
              </>
            )}

            {/* Inputs */}
            <input
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Inserta un título"
            />
            <hr />
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
            <button
              className="button"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              {!isEditing[0] && "Crear"}
              {isEditing[0] && "Editar"}
            </button>
          </form>
          {/* Seccion de informacion */}
          <div className="notes-info">
            <h2>Organiza tus ideas con simples notas de colores</h2>
            <ul>
              <li>
                Si habilitas la opcion de "público" en la nota todo el mundo
                podrá encontrarla en la{" "}
                <Link to="/public">sección de notas públicas</Link>
              </li>
              <li>
                Elige el color que más te guste clickeando el icono "👇" que se
                encuentra en la parte superior del formulario
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Notas del usuario */}
      <section className="notes-section" style={{ background: "#f7f7f7" }}>
        <h2>Mis Notas</h2>
        <ul>
          {notes === null || notes.length === 0 ? (
            <h3>No tienes ninguna nota en este momento, crea una! :D</h3>
          ) : (
            notes.map((note) => {
              const { _id, title, text, color, date } = note;

              return (
                <Note
                  key={_id}
                  content={{
                    id: _id,
                    title,
                    text,
                    color,
                    date,
                    isPublic: note.public,
                  }}
                  public={false}
                />
              );
            })
          )}
        </ul>
      </section>
    </>
  );
}

export default withRouter(Notes);
