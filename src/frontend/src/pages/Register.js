import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
const Axios = require("axios");

function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  let history = useHistory();
  const { setUserData } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const res = await Axios.post("http://localhost:4000/auth/register", form);
    const res = await Axios.post("/auth/register", form);

    if (res.data.errorMessage) {
      return setError(res.data.errorMessage);
    }

    const { token, username } = res.data;
    sessionStorage.setItem("auth-token", token);

    setUserData({
      token,
      username,
    });
    return history.push("/");
  };

  return (
    <div className="form-container">
      <form action="/" method="POST" className="note n-yellow">
        <h2>Registrate 🔒</h2>
        {error && <h4 className="alert">{error}</h4>}

        <div className="form-control">
          <label htmlFor="email">Mail</label>
          <input
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            value={form.email}
            type="email"
            id="email"
            name="email"
          />
        </div>
        <div className="form-control">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            value={form.username}
            type="text"
            id="username"
            name="username"
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Contraseña</label>
          <input
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            value={form.password}
            type="password"
            id="password"
            name="password"
          />
        </div>
        <div className="form-control">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            value={form.confirmPassword}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
          />
        </div>
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Register
        </button>
        <div className="form-footer">
          Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
