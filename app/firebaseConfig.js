
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBGYo1m2oDBAxMg6Ev0GsmY3GxdykGKmMg",
  authDomain: "adv-final-project-714d3.firebaseapp.com",
  projectId: "adv-final-project-714d3",
  storageBucket: "adv-final-project-714d3.appspot.com", 
  messagingSenderId: "116534471151",
  appId: "1:116534471151:web:f0dd1721889f06d784ee1a",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// export all the const
export { app, auth, db };
