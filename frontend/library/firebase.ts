import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtuXqByr5fUJSB5az_fZfmSUfvopxRJGQ",
  authDomain: "lazycare8866.firebaseapp.com",
  projectId: "lazycare8866",
  storageBucket: "lazycare8866.appspot.com",
  messagingSenderId: "1076620138730",
  appId: "1:1076620138730:web:55b30c064c980af4211f93",
  measurementId: "G-RF6CB6Y630"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

