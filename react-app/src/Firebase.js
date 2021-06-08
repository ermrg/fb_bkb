import firebase from "firebase";
// import firestore from "firebase/firestore";

const settings = { timestampsInSnapshots: true };

const config = {
  apiKey: "AIzaSyAhNs6P0exgJrx-UDQazPKEVyJqr89yArA",
  authDomain: "baagchal-8a452.firebaseapp.com",
  databaseURL: "https://baagchal-8a452-default-rtdb.firebaseio.com",
  projectId: "baagchal-8a452",
  storageBucket: "baagchal-8a452.appspot.com",
  messagingSenderId: "584397362493",
  appId: "1:584397362493:web:f58788a22d6e51cb706154",
  measurementId: "G-0KZ59H7NJ5",
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
