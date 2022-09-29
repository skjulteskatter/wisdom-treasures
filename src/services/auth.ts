import { firebaseConfig } from "../components/config"
import { FirebaseError, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    TwitterAuthProvider,
    FacebookAuthProvider,
    createUserWithEmailAndPassword,
    type UserCredential,

} from "firebase/auth";
import { AuthErrorCodesDict, notify } from "./notifications";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export async function loginWithEmailAndPassword(email: string, password: string){
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (error : any){
        notify(AuthErrorCodesDict.get(error.code) ?? "Error: " + error , "error");
    }
}

export async function signupWithEmailAndPassword(email: string, password: string){
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error : any){
        notify(AuthErrorCodesDict.get(error.code) ?? "Error: " + error , "error");
    }
}