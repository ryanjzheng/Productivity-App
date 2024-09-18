import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { FaGoogle, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import EvLogo from '../../assets/evlogo.png';
import backgroundImage from '../../assets/evbackground.png';

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
      await signInWithEmailAndPassword(auth, email, password);
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
      await signInWithPopup(auth, googleProvider);
      navigate('/today');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error));
        console.error('Error signing up with email and password:', error);
      }
    }
  };

  return (
    <section className={`vh-100 ${styles.loginContainer}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6">
            <div className={`${styles.loginContent} p-4`}>
              <div className={`${styles.logoContainer} mb-4`}>
                <img
                  src={EvLogo}
                  className="img-fluid"
                  alt="Login image"
                />
              </div>
              <form onSubmit={handleSignIn}>
                {errorMessage && (
                  <div className="mb-3 mt-3 text-danger text-center">
                    <small>{errorMessage}</small>
                  </div>
                )}
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
      </div>
    </section>
  );
};

export default Login;
