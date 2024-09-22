import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";


const firebaseConfig = {
    apiKey: "AIzaSyBe0Jxaw4xbmVFTZq4sKbAfsdWGFk22_zU",
    authDomain: "today-and-tomorrow-c40ef.firebaseapp.com",
    projectId: "today-and-tomorrow-c40ef",
    storageBucket: "today-and-tomorrow-c40ef.appspot.com",
    messagingSenderId: "295024277523",
    appId: "1:295024277523:web:be3ac3d0bb89fddf9ca7e6",
    measurementId: "G-2FSQ50LX0J"
};

const app = initializeApp(firebaseConfig);



if (process.env.NODE_ENV === 'development') {
    initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider('6Le8mUoqAAAAACqb_jjkHsyAVjjMl0vReRtVZwaO'),
        isTokenAutoRefreshEnabled: true
    });
} else {
    initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider('6Lcc4ksqAAAAAAXR1FnDT4vZS2v9M8eTXcpUYpg3'),
        isTokenAutoRefreshEnabled: true
    });
}



const vertexAI = getVertexAI(app);
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });


const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, googleProvider, db, model };