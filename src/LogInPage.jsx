
import "./Styles/LoginPage.css"
import cloudImage from "./assets/database-cloud.png"
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.js";

function LoginPage() {

  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = e.target[0].value;
    const userPassword = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, userEmail, userPassword);
      navigate("/");
    } catch (err) {
      setErr(true);
    }

  }

  return (
    <>
      <title>Login</title>
      <div className="logIn-container">
        <section className="main-content">
          <div className="blur">
            <form className="logIn-form" onSubmit={handleSubmit}>
              <Link to="/home" className="presentation-link">Presentation!</Link>
              <p className="login-text">
                Login
                <img className="cloud-image" src={cloudImage} />
              </p>
              <div className="input-box">

                <i id="icons" className='bx bxs-envelope'></i>
                <input
                  className="email"
                  id="email-input"
                  type="email"
                  placeholder=" "
                  autoComplete="off"
                  required
                />
                <label
                  htmlFor="email-input"
                  className="inputs-labels email-label email-login-label"
                >
                  Email:
                </label>

                <i id="icons" className="bx bxs-lock-alt" />
                <input
                  className="password"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  required
                  id="password-input"
                />
                <label
                  htmlFor="password-input"
                  className="inputs-labels password-label password-login-label"
                >
                  Password:
                </label>
              </div>
              <p className="register-text">
                Don't have an account? <Link to="/registration">Register</Link>
              </p>
              <button type="submit" className="login-button">
                Submit
              </button>
              {err && <span>Something went wrong!</span>}
            </form>
          </div>
        </section>
      </div>
    </>

  );
}

export default LoginPage