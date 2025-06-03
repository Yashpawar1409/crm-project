// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyDC6wp-4qL3zoE50VFru9xYtKoZ0QdojVQ",
  authDomain: "crm-client-51c50.firebaseapp.com",
  projectId: "crm-client-51c50",
  storageBucket: "crm-client-51c50.firebasestorage.app",
  messagingSenderId: "612315376979",
  appId: "1:612315376979:web:5486a3bfc1bfeda83a45a6",
  measurementId: "G-JDEJ2DSP6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
