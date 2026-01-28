import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBY1IGk0iGvapiajl86FDicvy9P6dE1Nls",
  authDomain: "susi-81355.firebaseapp.com",
  projectId: "susi-81355",
  storageBucket: "susi-81355.firebasestorage.app",
  messagingSenderId: "1045442614164",
  appId: "1:1045442614164:web:c8575eb445730a42b5b581",
  measurementId: "G-VXJ3BX7N3L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
