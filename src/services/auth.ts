/* eslint-disable no-console */
import { initializeApp } from "firebase/app";
import { 
    applyActionCode, 
    browserLocalPersistence, 
    browserSessionPersistence, 
    createUserWithEmailAndPassword, 
    FacebookAuthProvider, 
    fetchSignInMethodsForEmail, 
    getAuth, 
    GoogleAuthProvider, 
    OAuthProvider, 
    onAuthStateChanged, 
    signInWithCustomToken, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    TwitterAuthProvider, 
    updatePassword, 
    updateProfile, 
} from "firebase/auth";
import type { User, UserCredential, AuthProvider } from 'firebase/auth';
import "firebase/compat/performance";
import router from "@/router";
import { useSessionStore } from "@/stores/session";
import { sessionType } from "@/@types/sessionTypes";
import { notify } from "./notify";
import { firebaseConfig } from "@/config";
import http from "./http";

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export async function loginWithEmailAndPassword(email: string, password: string){
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredentials)
}

export async function getBearerToken(): Promise<string>{
    return "";
}