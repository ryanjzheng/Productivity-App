import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FirebaseError } from 'firebase/app';

const errorMessages: { [key: string]: string } = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/operation-not-allowed': 'Operation not allowed.',
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/missing-password': 'Please enter a password.',
  'auth/invalid-credential': 'Wrong email or password.'
};

const getErrorMessage = (error: FirebaseError): string => {
  return errorMessages[error.code] || error.message;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in with email and password:', userCredential);
      navigate('/today');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error));
        console.error('Error signing up with email and password:', error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Signed in with Google:', result);
      navigate('/today');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error));
        console.error('Error signing up with email and password:', error);
      }
    }
  };

  return (
    <section className={`vh-100 ${styles.loginContainer}`}>
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
            {errorMessage && (
              <div className="mt-3 text-danger text-center">
                <small>{errorMessage}</small>
              </div>
            )}
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={handleSignIn}>
              {/* Email input */}
              <div data-mdb-input-init className={`form-outline mb-4 ${styles.formOutline}`}>
                <MDBInput
                  type="email"
                  id="form1Example13"
                  className="form-control form-control-lg"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password input */}
              <div data-mdb-input-init className={`form-outline mb-4 ${styles.formOutline}`}>
                <MDBInput
                  type="password"
                  id="form1Example23"
                  className="form-control form-control-lg"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit button */}
              <MDBBtn
                type="submit"
                data-mdb-button-init
                data-mdb-ripple-init
                className="btn btn-primary btn-lg btn-block"
                style={{ marginBottom: '1rem' }} 
              >
                Sign in
              </MDBBtn>

              <div className="d-flex justify-content-around align-items-center mb-4">
                {/* Checkbox */}
                {/* <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value="" 
                    id="form1Example3" 
                    defaultChecked 
                  />
                  <label className="form-check-label" htmlFor="form1Example3">
                    Remember me
                  </label>
                </div> */}
                <Link to="/signup" className="text-decoration-none">Sign up</Link>
                <a href="#!">Forgot password?</a>
              </div>

              <div className={`${styles.divider} d-flex align-items-center my-4`}>
                <hr className="flex-fill" />
                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                <hr className="flex-fill" />
              </div>
              <MDBBtn
                onClick={handleGoogleSignIn}
                data-mdb-ripple-init
                className="btn btn-primary btn-lg btn-block"
                style={{ backgroundColor: '#db4437' }}
                href="#!"
                role="button"
              >
                <FaGoogle className="me-2" />Continue with Google
              </MDBBtn>
              <MDBBtn
                data-mdb-ripple-init
                className="btn btn-primary btn-lg btn-block"
                style={{ backgroundColor: '#3b5998' }}
                href="#!"
                role="button"
              >
                <FaFacebookF className="me-2" />Continue with Facebook
              </MDBBtn>
              <MDBBtn
                data-mdb-ripple-init
                className="btn btn-primary btn-lg btn-block"
                style={{ backgroundColor: '#55acee' }}
                href="#!"
                role="button"
              >
                <FaTwitter className="me-2" />Continue with Twitter
              </MDBBtn>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
