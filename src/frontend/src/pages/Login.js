import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";

import Axios from "axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { userData, setUserData } = useUserContext();
  const history = useHistory();

  useEffect(() => {
    if (userData.token) {
      history.push("/notes");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const res = await Axios.post("http://localhost:4000/auth/login", {
    //   email: form.email,
    //   password: form.password,
    // });
    const res = await Axios.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    if (res.data.errorMessage) {
      return setError(res.data.errorMessage);
    }

    const { token, username } = res.data;

    sessionStorage.setItem("auth-token", token);
    setUserData({
      token,
      username,
    });

    history.push("/notes");
  };

  return (
    <div className="form-container">
      <form action="/" method="POST" className="note n-yellow">
        <h2>Iniciar sesion 🗝️</h2>
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
          <label htmlFor="password">Contraseña</label>
          <input
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            value={form.password}
            type="password"
            id="password"
            name="password"
          />
        </div>
        <button
          className="button"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Iniciar sesion
        </button>
        <div className="form-footer">
          No tienes una cuenta? <Link to="/register">Registrate</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
