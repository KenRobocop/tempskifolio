import { getStorage } from "firebase/storage"; // Add this line
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyDV7FQssUQFafUndD3OjlQV8djAFKEHBZA",
  authDomain: "practiceapp-13602.firebaseapp.com",
  projectId: "practiceapp-13602",
  storageBucket: "practiceapp-13602.appspot.com",
  messagingSenderId: "315638640724",
  appId: "1:315638640724:web:126e597ca42d4c25e2fdc1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // This line was missing

export { auth, db, storage };  // Export storage now
