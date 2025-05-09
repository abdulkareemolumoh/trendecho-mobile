// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP1z1mKrsfuBGIDw9q1JPuY_O5WN9wmdU",
  authDomain: "trendecho-1981c.firebaseapp.com",
  databaseURL: "https://trendecho-1981c-default-rtdb.firebaseio.com",
  projectId: "trendecho-1981c",
  storageBucket: "trendecho-1981c.appspot.com",
  messagingSenderId: "1081479127455",
  appId: "1:1081479127455:web:8bb4713788eb3794ccddaa",
  measurementId: "G-KPH5HTX1JC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
