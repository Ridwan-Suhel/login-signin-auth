import "./App.css";

import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "./firebase.init";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegister] = useState(false);

  const [validated, setValidated] = useState(false);

  // const handleSubmit = (event) => {};

  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };
  const handlePassBlur = (event) => {
    setPassword(event.target.value);
  };

  const handleRegister = (event) => {
    setRegister(event.target.checked);
    console.log(event.target.checked);
  };
  const handleSubmitForm = (event) => {
    console.log(email, password);
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    setValidated(true);

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError("Password should contain at least one special charecter");
      return;
    }

    setError("");

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPassword("");
          sendVerification();
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        });
    }
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("Password Reset message sent");
    });
  };

  const sendVerification = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email Verification sent");
    });
  };

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-7">
            <h3 className="my-3 text-primary">
              Please {registered ? "LogIn" : "Register"}
            </h3>
            <Form noValidate validated={validated} onSubmit={handleSubmitForm}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  onBlur={handleEmailBlur}
                  type="email"
                  placeholder="Enter email"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onBlur={handlePassBlur}
                  type="password"
                  placeholder="Password"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
                <p className="my-3 text-danger">{error}</p>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  onChange={handleRegister}
                  type="checkbox"
                  label="Already Registered?"
                />
                <Button
                  onClick={handlePasswordReset}
                  variant="link"
                  className="p-0"
                >
                  Forgot password?
                </Button>
              </Form.Group>
              <Button variant="primary" type="submit">
                {registered ? "LogIn" : "Register"}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
