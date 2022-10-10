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
    sendEmailVerification, 
    signInWithCustomToken, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    TwitterAuthProvider, 
    updatePassword, 
    updateProfile, 
} from "firebase/auth";
import type { User, UserCredential, AuthProvider } from 'firebase/auth';
import "firebase/compat/performance";
import { useSessionStore } from "@/stores/session";
import { sessionType } from "@/@types/sessionTypes";
import { notify } from "./notify";
import { firebaseConfig } from "@/config";
import http from "./http";
import router, { navigateTo } from "@/router";
import { routes } from "@/router";

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export async function loginWithEmailAndPassword(email: string, password: string){
    const userCredentials : UserCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredentials.user.emailVerified){
        await sendEmailVerification(userCredentials.user);
        console.log("Verification email sent: " + email);
    } else {
        useSessionStore().setSessionType(sessionType.EMAIL_VERIFIED, true);
    }
}

export async function signupWithEmailAndPassword(email: string, password: string){
    const userCredentials : UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredentials.user);
    console.log("Verification email: " + email);
}

onAuthStateChanged(auth, async user => {
    const store = useSessionStore();
    if (user) {
        store.setSessionType(sessionType.EMAIL_VERIFIED, user.emailVerified);
        store.setSessionType(sessionType.LOGGED_IN, true);
        console.log("Logged in", auth.currentUser);
        await navigateTo("home");
    } else {
        store.setSessionType(sessionType.LOGGED_IN, false);
        console.log("Logged out", auth.currentUser);
        await navigateTo("login");
    }
});

export async function updateUser(displayName : string = auth.currentUser?.displayName ?? "", photoURL : string = auth.currentUser?.photoURL ?? "" ): Promise<boolean> {

    if (!auth.currentUser) return false;

    try {
        await updateProfile(auth.currentUser, {
            displayName: displayName, photoURL: photoURL
        })
        return true;
    } catch {
        return false;
    }
}