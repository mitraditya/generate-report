// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCHoEOtFY3LVJZnNTA1ZGh00XapcG1BTP0",
    authDomain: "report-app-a9556.firebaseapp.com",
    projectId: "report-app-a9556",
    storageBucket: "report-app-a9556.appspot.com",
    messagingSenderId: "145362904649",
    appId: "1:145362904649:web:6c6ac075ba0ac94e504198",
    measurementId: "G-ZM37J2CC5S"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export firestore database
// It will be imported into your react app whenever it is needed
export const storage = getStorage(app);