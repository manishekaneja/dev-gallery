import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { firebaseKeys } from "./firebase-keys";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

firebase.initializeApp(firebaseKeys);

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();

export { projectFirestore, projectStorage, projectAuth };
