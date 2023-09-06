// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'near-social-bridge.firebaseapp.com',
  projectId: 'near-social-bridge',
  storageBucket: 'near-social-bridge.appspot.com',
  messagingSenderId: '577123789795',
  appId: '1:577123789795:web:c3cfeb97317bc5e1d30ed6',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore
export const db = getFirestore(app)

// Helpers
export const getDocument = (collection: string, document: string) => {
  const docRef = doc(db, collection, document)
  return getDoc(docRef)
}
