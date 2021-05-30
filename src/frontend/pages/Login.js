import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import Axios from "axios";

// Components
import FormControl from "../components/FormControl";
import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";

// Contexts
import { useUserContext } from "../contexts/userContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { userData, setUserData } = useUserContext();
  const history = useHistory();

  // Check if the user is already logged
  // ***********************************
  useEffect(() => {
    if (userData.token) history.push("/notes");
  }, [userData]);
  useEffect(() => {
    if (userData.token) history.push("/notes");
  }, []);

  // Login
  // *****
  const handleLogin = async (e) => {
    e.preventDefault();

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
    <div className="container container-centered">
      <form action="/" method="POST" className="note n-yellow register-form">
        <h2>Iniciar sesion</h2>

        <Alert msg={error} action={() => setError(null)} />

        <FormControl
          value={form.email}
          forHTML="email"
          type="email"
          label="Mail:"
          action={(e) => setForm({ ...form, email: e.target.value })}
        />
        <FormControl
          value={form.password}
          forHTML="password"
          type="password"
          label="Contraseña:"
          action={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button
          text="Iniciar sesion"
          type="submit"
          action={(e) => handleLogin(e)}
        />

        <div className="form-footer">
          No tienes una cuenta? <Link to="/register">Registrate</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
