// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage";   

const firebaseConfig = {
  apiKey: "AIzaSyD2jMDFiVMaQOa3hHR8XxdaIgrMFDbPFxI",
  authDomain: "hotel-room-booking-e8f76.firebaseapp.com",
  databaseURL: "https://hotel-room-booking-e8f76-default-rtdb.firebaseio.com",
  projectId: "hotel-room-booking-e8f76",
  storageBucket: "hotel-room-booking-e8f76.firebasestorage.app",
  messagingSenderId: "396114396761",
  appId: "1:396114396761:web:684b7111de585c36ba1348",
  measurementId: "G-GJ13YG3364"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);       
export const db = getDatabase(app);     
export const database = getDatabase(app);
export const storage = getStorage(app); 
