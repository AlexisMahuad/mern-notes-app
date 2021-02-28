import React from "react";
// Contexts
import { useNotesContext } from "../contexts/notesContext";

import moment from "moment";
moment.updateLocale("en", {
  relativeTime: {
    future: "en %s",
    past: "Hace %s",
    s: "unos segundos",
    ss: "%d segundos",
    m: "un minuto",
    mm: "%d minutos",
    h: "una hora",
    hh: "%d horas",
    d: "un dia",
    dd: "%d dias",
    w: "una semana",
    ww: "%d semanas",
    M: "un mes",
    MM: "%d meses",
    y: "un año",
    yy: "%d años",
  },
});

function Note(props) {
  const { id, title, text, color, author, date, isPublic } = props.content;

  // Context
  const {
    pickNoteColor,
    setForm,
    setIsEditing,
    setAlert,
    handleDelete,
  } = useNotesContext();

  return (
    <li className={`note ${pickNoteColor(color)}`}>
      {/* Note Header */}
      <h4>{title}</h4>
      {props.public && <p className="username">Nota de: {author}</p>}
      <hr />

      {/* Note Body */}
      <p>{text}</p>

      {/* Note Footer */}
      <div className="note-footer">
        <p>{moment(date).fromNow()}</p>
        {!props.public && (
          <div>
            <>
              <button className="button" onClick={() => handleDelete(id)}>
                Borrar
              </button>
              <button
                className="button"
                onClick={() => {
                  setAlert({ type: null, message: "" });
                  setForm({ title, text, color, public: isPublic });
                  setIsEditing([true, id]);
                }}
              >
                Editar
              </button>
            </>
          </div>
        )}
      </div>
    </li>
  );
}

export default Note;
