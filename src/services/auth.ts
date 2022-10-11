/* eslint-disable no-console */
import { initializeApp } from "firebase/app";
import { 
    createUserWithEmailAndPassword, 
    getAuth, 
    GoogleAuthProvider, 
    OAuthProvider, 
    onAuthStateChanged, 
    sendEmailVerification, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    updateProfile,
    browserLocalPersistence, 
    browserSessionPersistence, 
} from "firebase/auth";
import type { UserCredential } from 'firebase/auth';
import "firebase/compat/performance";
import { useSessionStore } from "@/stores/session";
import { sessionType } from "@/@types/sessionTypes";
import config from "@/config";
import { navigateTo } from "@/router";

export const firebaseApp = initializeApp(config.firebaseConfig);

export const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

//Configure providers
const googleAuthProvider = new GoogleAuthProvider();
const appleAuthProvider = new OAuthProvider("apple.com");
appleAuthProvider.addScope("email");
appleAuthProvider.addScope("name");


export async function loginWithEmailAndPassword(email: string, password: string, rememberMe: boolean) {
    console.log("Logging in with email and password..."); // TODO remove this
    setPersistence(rememberMe);

    const userCredentials : UserCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredentials.user.emailVerified){
        await sendEmailVerification(userCredentials.user);
        console.log("Verification email sent: " + email); // TODO remove this
    } else {
        useSessionStore().setSessionType(sessionType.EMAIL_VERIFIED, true);
    }
}

export async function loginWithProvider(providerName : string, rememberMe: boolean){

    setPersistence(rememberMe);

    let provider = undefined;
    switch (providerName) {
        case "google":
            provider = googleAuthProvider;
            break;
        case "apple":
            provider = appleAuthProvider;
            break;
        default:
            return;
    }
    console.log(providerName);
    console.log(provider);
    const userCredentials : UserCredential = await signInWithPopup(auth, provider);
    if (userCredentials.user){
        useSessionStore().setSessionType(sessionType.EMAIL_VERIFIED, true);
    }
}

export async function signupWithEmailAndPassword(email: string, password: string){
    const userCredentials : UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredentials.user);
    console.log("Verification email: " + email); //TODO remove this
}

onAuthStateChanged(auth, async user => {
    const store = useSessionStore();
    if (user) {
        store.setSessionType(sessionType.EMAIL_VERIFIED, user.emailVerified);
        store.setSessionType(sessionType.LOGGED_IN, true); //TODO remove this
        console.log("Logged in", auth.currentUser);
        await navigateTo("home");
    } else {
        store.setSessionType(sessionType.LOGGED_IN, false);
        console.log("Logged out", auth.currentUser); //TODO remove this
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

function setPersistence(rememberMe : boolean = false){
    if (rememberMe){
        auth.setPersistence(browserLocalPersistence);
    } else {
        auth.setPersistence(browserSessionPersistence);
    }
}
