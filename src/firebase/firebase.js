// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD321eSbmD6TFT2JWglTf4DYodgnOhoPkg",
  authDomain: "lkiupi.firebaseapp.com",
  projectId: "lkiupi",
  storageBucket: "lkiupi.appspot.com",
  messagingSenderId: "129143593141",
  appId: "1:129143593141:web:150db66b574abab29e46fc",
  measurementId: "G-51P03TXVTJ"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const storage = getStorage(app);

export { db, storage };