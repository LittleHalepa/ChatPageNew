
import "./Styles/LoginPage.css"
import cloudImage from "./assets/database-cloud.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; 
import {auth, db} from "./firebase.js"
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore"; 
import {useNavigate} from "react-router-dom"

function RegisterPage() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const userEmail = e.target[1].value;
    const userPassword = e.target[2].value;


    try {
      const response = await createUserWithEmailAndPassword(auth, userEmail, userPassword);

      await updateProfile(response.user, {
        displayName
      });

      await setDoc(doc(db, "users", response.user.uid), {
        uid: response.user.uid,
        displayName,
        userEmail,
      });

      await setDoc(doc(db, "userChats", response.user.uid), {});

      navigate("/");

    } catch (err) {
      setErr(true);
    }

  }

  return (
    <>
      <title>Register</title>
      <div className="logIn-container">
        <section className="main-content">
          <div className="blur">
            <form className="logIn-form" onSubmit={handleSubmit}>
              <p className="login-text">
                Registration
                <img className="cloud-image" src={cloudImage} />
              </p>
              <div className="input-box">
                <i id="icons" className="bx bxs-user" />
                <input
                  className="username"
                  id="username-input"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  required
                />
                <label
                  htmlFor="username-input"
                  className="inputs-labels username-label"
                >
                  Username:
                </label>

                <div className="line">
                
                </div>

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
                  className="inputs-labels email-label"
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
                  className="inputs-labels password-label"
                >
                  Password:
                </label>
              </div>
              <p className="exited-to-see">
                We are surer exited to <span className="exited-to-see-span">see you!</span>
              </p>
              <button type="submit" className="login-button">
                Get Started!
              </button>
              {err && <span>Something went wrong!</span>}
            </form>
          </div>
        </section>
      </div>
    </>

  );
}

export default RegisterPage