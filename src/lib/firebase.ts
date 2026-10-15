import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Configuração web pública. A proteção dos dados está em firestore.rules.
export const firebaseConfig = {
  apiKey: "AIzaSyBp9Quq4nYaNyYj98akdAo9N0uS25L54Tw",
  authDomain: "fsantos-portfolio.firebaseapp.com",
  projectId: "fsantos-portfolio",
  storageBucket: "fsantos-portfolio.firebasestorage.app",
  messagingSenderId: "28933176927",
  appId: "1:28933176927:web:0f7adbd92544e9f1dce5ea",
  measurementId: "G-JR5WX4TE7Z",
}

export const ADMIN_EMAIL = "leyfps@gmail.com"

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
