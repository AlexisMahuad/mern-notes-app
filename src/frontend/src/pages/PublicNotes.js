import React, { useState, useEffect } from "react";
// Components
import Note from "../components/Note";

import Axios from "axios";

function PublicNotes() {
  const [publicNotes, setPublicNotes] = useState(null);

  const getPublicNotes = async () => {
    // const fetchPublicNotes = await Axios.get(
    //   "http://localhost:4000/api/notes/public"
    // );
    const fetchPublicNotes = await Axios.get("/api/notes/public");
    setPublicNotes(fetchPublicNotes.data);
  };

  useEffect(() => {
    getPublicNotes();
  }, []);

  return (
    <section className="notes-section">
      <h2>Notas Publicas</h2>

      {/* If there aren't notes */}
      {!publicNotes ||
        (publicNotes.length === 0 && (
          <p>
            No hay ninguna nota publica en este momento, no seas timido y se el
            primero en publicar una! :D
          </p>
        ))}
      {/* If there are notes */}
      {publicNotes && (
        <ul>
          {publicNotes.map((note) => {
            const { _id, title, text, color, author, date } = note;

            return (
              <Note
                key={_id}
                content={{ id: _id, title, text, color, author, date }}
                public={true}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default PublicNotes;
