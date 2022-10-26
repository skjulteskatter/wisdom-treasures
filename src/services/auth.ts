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
import { useSessionStore } from "@/stores/session";

export const firebaseApp = initializeApp(config.firebaseConfig);

export const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

//Configure providers
const googleAuthProvider = new GoogleAuthProvider();
const appleAuthProvider = new OAuthProvider("apple.com");
appleAuthProvider.addScope("email");
appleAuthProvider.addScope("name");


export async function loginWithEmailAndPassword(email: string, password: string, rememberMe: boolean): Promise<boolean> {
    await setPersistence(rememberMe);

    const userCredentials : UserCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredentials)
    if (!userCredentials.user.emailVerified){
        await sendEmailVerification(userCredentials.user);
        return false;
    }
    
    router.push({ name: 'home' });
    return true;
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
}

onAuthStateChanged(auth, async user => {
    const loggedIn = !!auth.currentUser;
    useSessionStore().loggedIn = loggedIn;
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
