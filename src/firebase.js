
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 


const firebaseConfig = {
  apiKey: "AIzaSyCcCBJUo4T5xe289qLoLKo2P31tFE4OpUU",
  authDomain: "todotest-7870f.firebaseapp.com",
  projectId: "todotest-7870f",
  storageBucket: "todotest-7870f.firebasestorage.app",
  messagingSenderId: "661987567198",
  appId: "1:661987567198:web:ebf98abe6b0e984fdc36cf"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
