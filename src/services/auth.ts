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
import config from "@/config";
import router from "@/router";

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


    await setPersistence(rememberMe);

    const userCredentials : UserCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredentials)
    if (!userCredentials.user.emailVerified){
        await sendEmailVerification(userCredentials.user);
        console.log("Verification email sent: " + email); // TODO remove this
    } else {
        router.push({ name: 'home' });
    }
}

export async function loginWithProvider(providerName : string, rememberMe: boolean){

    await setPersistence(rememberMe);

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

    const userCredentials : UserCredential = await signInWithPopup(auth, provider);
}

export async function signupWithEmailAndPassword(email: string, password: string){
    const userCredentials : UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredentials.user);
    console.log("Verification email: " + email); //TODO remove this
}

let initialStateChanged = false;

onAuthStateChanged(auth, async user => {
    if (!initialStateChanged){
        initialStateChanged = true;
        return;
    }
    console.log("Auth state changed: ");
    if (user) {
        console.log("Logged in", auth.currentUser); //TODO remove this
        router.push({ name: 'home' })
    } else {
        console.log("Logged out", auth.currentUser); //TODO remove this
        router.push({ name: 'login' })
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

async function setPersistence(rememberMe : boolean = false){
    if (rememberMe)
        return await auth.setPersistence(browserLocalPersistence);

    await auth.setPersistence(browserSessionPersistence);
}
