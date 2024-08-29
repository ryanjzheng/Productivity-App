import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from '../Login/Login.module.css';
import { auth, googleProvider } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import { db } from '../../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';

const errorMessages: { [key: string]: string } = {
  'auth/email-already-in-use': 'Email address is already in use.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/operation-not-allowed': 'Operation not allowed.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/missing-password': 'Please enter a password.',
};

const getErrorMessage = (error: FirebaseError): string => {
  return errorMessages[error.code] || error.message;
};

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error message
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        createdAt: new Date().toISOString(),
      });

      const userTasksRef = collection(db, 'users', uid, 'tasks');
      await setDoc(doc(userTasksRef), {
        title: 'Welcome Task', // Placeholder task document, optional
        text: 'This is your first task. Edit or delete me!',
        order: 0,
      });


      console.log('Signed up with email and password:', userCredential);
      navigate('/today');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error));
        console.error('Error signing up with email and password:', error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(''); // Clear previous error message
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;

      await setDoc(doc(db, 'users', uid), {
        createdAt: new Date().toISOString(),
      });

      const userTasksRef = collection(db, 'users', uid, 'tasks');
      await setDoc(doc(userTasksRef), {
        title: 'Welcome Task', // Placeholder task document, optional
        text: 'This is your first task. Edit or delete me!',
        order: 0,
      });

      console.log('Signed up with Google:', result);
      navigate('/today');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error));
        console.error('Error signing up with Google:', error);
      }
    }
  };

  return (
    <section className={`vh-100 ${styles.signupContainer}`}>
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={handleSignUp}>
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
                Sign up
              </MDBBtn>

              <div className="d-flex justify-content-around align-items-center mb-4">
                <Link to="/login" className="text-decoration-none">Log in</Link>
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
              {/* <MDBBtn
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
              </MDBBtn> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
