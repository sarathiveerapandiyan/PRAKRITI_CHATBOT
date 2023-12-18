import { getAuth } from 'firebase/auth';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database'


// Configure Firebase with your credentials
const firebaseConfig = {
  apiKey: "AIzaSyBPq683WR9Z7iShYY-ctiJtY4xE3RhtkK0",
  authDomain: "prakrathi-c3a46.firebaseapp.com",
  projectId: "prakrathi-c3a46",
  storageBucket: "prakrathi-c3a46.appspot.com",
  messagingSenderId: "703138036556",
  appId: "1:703138036556:web:168e4c24a488667dca6de9",
  measurementId: "G-BK9GT6KQXM"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // Initialize Authentication service
const database = getDatabase(firebaseApp); // Initialize Realtime Database service


export { auth, database };