import { firebaseConfig } from "../components/config"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    TwitterAuthProvider,
    FacebookAuthProvider,

} from "firebase/auth";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export async function loginWithEmailAndPassword(email: string, password: string){
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential);
}