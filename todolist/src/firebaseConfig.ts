// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
const db = getFirestore(app);

export { db };
