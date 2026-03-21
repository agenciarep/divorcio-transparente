import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIRPxT29q-L0wXdHwA0_u_g0AMsXwyCQ8",
  authDomain: "divorcio-transparente.firebaseapp.com",
  projectId: "divorcio-transparente",
  storageBucket: "divorcio-transparente.firebasestorage.app",
  messagingSenderId: "744347929952",
  appId: "1:744347929952:web:c5e6e972a819e079666205"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
