import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTXHcL5xZ6iWG59x26P_QK6E7wbhsufHQ",
  authDomain: "iitb-power-systems.firebaseapp.com",
  projectId: "iitb-power-systems",
  storageBucket: "iitb-power-systems.appspot.com",
  messagingSenderId: "936757663429",
  appId: "1:936757663429:web:329d46ad0f387180b2c2ac",
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const storage = getStorage(firebaseApp);
