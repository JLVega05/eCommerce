import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA8qzond-bceUvSbebutYF7_y5VzYQbMI",
  authDomain: "ecommerce-cdc02.firebaseapp.com",
  projectId: "ecommerce-cdc02",
  storageBucket: "ecommerce-cdc02.firebasestorage.app",
  messagingSenderId: "198610226048",
  appId: "1:198610226048:web:2f456e617c53ae791f8f65"
};
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
