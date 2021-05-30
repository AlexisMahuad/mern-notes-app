import React, { useEffect } from "react";
import Axios from "axios";
import { useParams, useHistory } from "react-router-dom";

// Contexts
import { useNotesContext } from "../contexts/notesContext";
import { useUserContext } from "../contexts/userContext";

// Components
import Button from "../components/Button/Button";

function ValidateMail() {
  const { setAlert } = useNotesContext();
  const { userData } = useUserContext();
  const history = useHistory();
  const id = useParams().id;

  useEffect(() => {
    if (userData.token || !id) history.push("/login");
  }, [userData]);
  useEffect(() => {
    if (userData.token || !id) history.push("/login");
  }, []);

  async function setPending() {
    await Axios.post("/auth/pending", { id });
    history.push("/login");
  }

  return (
    <div className="container container-centered">
      <div className="note n-blue">
        <h2>Por favor, valida tu correo.</h2>

        <Button text="Validar" action={() => setPending()} />
      </div>
    </div>
  );
}

export default ValidateMail;
