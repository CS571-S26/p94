import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAeak5_ylBEvBio3PwNHjywARtaniyTr80",
  authDomain: "flowstate-7eb57.firebaseapp.com",
  projectId: "flowstate-7eb57",
  storageBucket: "flowstate-7eb57.firebasestorage.app",
  messagingSenderId: "811762569814",
  appId: "1:811762569814:web:9e008a4d8478f5c962a1f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
