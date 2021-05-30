import React, { useEffect, useRef } from "react";
import Axios from "axios";

// Components
import Note from "../components/Note/Note";
import Loader from "../components/Loader";

// Contexts
import { useNotesContext } from "../contexts/notesContext";

// Hooks
import useNearScreen from "../hooks/useNearScreen";

function PublicNotes() {
  const {
    pBottomReached,
    setPBottomReached,
    pLoading,
    setPLoading,
    pFrom,
    setPFrom,
    publicNotes,
    setPublicNotes,
  } = useNotesContext();

  useEffect(() => {
    getPublicNotes(pFrom);
  }, []);

  // Infinite Scroll
  // ***************
  const externalRef = useRef();
  const { isNearScreen } = useNearScreen({
    distance: "100px",
    externalRef: pLoading ? null : externalRef,
    once: false,
  });

  useEffect(() => {
    if (!pBottomReached && isNearScreen) {
      setPLoading(true);
      getPublicNotes(pFrom);
    }
  }, [isNearScreen]);

  //  Get Public Notes
  // *****************
  const getPublicNotes = async (query) => {
    const fetchedNotes = (await Axios.get(`/api/notes/public/${query}`)).data;

    if (!publicNotes) {
      setPublicNotes(fetchedNotes);
    } else {
      setPublicNotes(publicNotes.concat(fetchedNotes));
    }

    if (fetchedNotes.length < 8) {
      setPBottomReached(true);
    }

    setPFrom(pFrom + fetchedNotes.length);
    setPLoading(false);
  };

  // ***********************************
  return (
    <section className="notes-section">
      <h2>Notas Publicas</h2>

      {/* If there aren't notes */}
      {!pLoading && (!publicNotes || publicNotes.length === 0) && (
        <h4 style={{ maxWidth: "300px", margin: "auto", textAlign: "center" }}>
          No hay ninguna nota publica en este momento, no seas timido y se el
          primero en publicar una! :D
        </h4>
      )}

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

      {/* Bottom Reached Message */}
      {pBottomReached && (
        <h2 style={{ marginTop: "40px" }}>Has llegado al final</h2>
      )}

      {/* Loader */}
      {pLoading && <Loader />}

      {/* End reference (infinite scroll)*/}
      <div ref={externalRef}></div>
    </section>
  );
}

export default PublicNotes;
