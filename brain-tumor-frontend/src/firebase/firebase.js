import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2I_11vW_TwByIh4-MuBbIEvt50RbRlW4",
  authDomain: "braintumor-69e44.firebaseapp.com",
  projectId: "braintumor-69e44",
  storageBucket: "braintumor-69e44.appspot.com",
  messagingSenderId: "90247967895",
  appId: "1:90247967895:web:c34c95c579bc63360ee5d2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);



export { app, auth, db, storage };