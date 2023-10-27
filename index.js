// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  child,
  set,
  get,
  push,
  update,
  remove,
} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Import my firebase class
import FireBaseDB from "./database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVCWConwcMM-mfgKw9GafBp1lPdMdVVfc",
  authDomain: "firstry-firebase.firebaseapp.com",
  databaseURL: "https://firstry-firebase.firebaseio.com",
  projectId: "firstry-firebase",
  storageBucket: "firstry-firebase.appspot.com",
  messagingSenderId: "456817158758",
  appId: "1:456817158758:web:b98b373987b2965ce9dba7",
};
const versionObj = {
  ref: ref,
  onValue: onValue,
  child: child,
  set: set,
  get: get,
  push: push,
  update: update,
  remove: remove,
  getAuth: getAuth,
};

//INITIALIZATION
FireBaseDB.init(firebaseConfig, initializeApp, getDatabase, versionObj);

//CREATE
export function firebaseCreate(ref, dataObj) {
  FireBaseDB.operation("create", [ref, dataObj])
    .then(() => console.log("Data created"))
    .catch(() => console("error creation not completed"));
}

//UPDATE
export function firebaseUpdate(ref, dataObj) {
  FireBaseDB.operation("update", [
    {
      [ref]: dataObj,
    },
  ])
    .then(() => console.log("Data Update succeed"))
    .catch(() => console("error update not completed"));
}

//DELETE

export async function firebaseDelete(ref) {
  let msg = await FireBaseDB.operation("delete", [ref]);
  //console.log(msg);
  return msg.message;
}

//READ
export function firebaseRead(ref) {
  return FireBaseDB.operation("read", [ref])
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
        /// console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

//LISTENING ON VALUE
let objct = {};
//FireBaseDB.listenOn("agent", objct, (data) => {
// console.log(data);
//});

/*

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

console.log(database);

*/
