import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
const Axios = require("axios");

// Contexts
import { useUserContext } from "../contexts/userContext";

// Components
import FormControl from "../components/FormControl";
import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";

function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    pending: true,
  });
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const { userData } = useUserContext();
  const history = useHistory();

  // Check if the user is already logged
  // ***********************************
  useEffect(() => {
    if (userData.token) history.push("/notes");
  }, [userData]);
  useEffect(() => {
    if (userData.token) history.push("/notes");
  }, []);

  // User Registration
  // *****************
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await Axios.post("/auth/register", form);

    if (res.data.errorMessage) {
      return setError(res.data.errorMessage);
    }

    const { status } = res.data;

    if (status) {
      setRegistered(true);
    } else {
      setError(
        "Ha ocurrido algo inesperado. Intente registrarse en otro momento"
      );
    }
  };

  return !registered ? (
    <div className="container container-centered">
      <form action="/" method="POST" className="note n-yellow register-form">
        <h2>Registrate</h2>

        <Alert msg={error} action={() => setError(null)} />

        <FormControl
          value={form.email}
          forHTML="email"
          type="email"
          label="Email:"
          action={(e) => setForm({ ...form, email: e.target.value })}
        />
        <FormControl
          value={form.username}
          forHTML="username"
          type="text"
          label="Nombre de usuario:"
          action={(e) => setForm({ ...form, username: e.target.value })}
        />
        <FormControl
          value={form.password}
          forHTML="password"
          type="password"
          label="Contraseña:"
          action={(e) => setForm({ ...form, password: e.target.value })}
        />
        <FormControl
          value={form.confirmPassword}
          forHTML="confirmPassword"
          type="password"
          label="Confirmar contraseña:"
          action={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <Button text="Registrarse" action={(e) => handleSubmit(e)} />

        <div className="form-footer">
          Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </form>
    </div>
  ) : (
    <div className="container container-centered">
      <div className="note n-green" style={{ textAlign: "center" }}>
        <h2>Registrado correctamente</h2>
        <p>
          Hemos enviado un <strong>correo de validacion</strong> a tu email.{" "}
          <br />
          Valida tu cuenta para comenzar a utilizar NotesApp.
        </p>

        <Button
          text="Volver a la pagina principal"
          action={() => history.push("/")}
        />
      </div>
    </div>
  );
}

export default Register;
