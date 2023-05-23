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
    signOut,
    updatePassword, 
    type User, 
} from "firebase/auth";
import type { UserCredential } from 'firebase/auth';
import "firebase/compat/performance";
import config from "@/config";
import router from "@/router";
import { useSessionStore } from "@/stores/session";
import { favorites } from "./api";

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
    
    pushToDashboardOrRedirectLink();
    return true;
}

export async function loginWithProvider(providerName : string, rememberMe: boolean) {

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
    pushToDashboardOrRedirectLink();
}

function pushToDashboardOrRedirectLink(){
    const store = useSessionStore();

    let name = store.$state.redirectAfterLoginName;
    store.$state.redirectAfterLoginName = "";

    if (name.length <= 0)
      name = "dashboard";

    router.push({name: name});
}

export async function signupWithEmailAndPassword(email: string, password: string){
    const userCredentials : UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredentials.user);
}

let userLoaded: boolean = false || !!auth.currentUser;
let storeInitialized = false;
export function getCurrentUserPromise(): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
     if (userLoaded) {
            resolve(auth.currentUser);
            if (!storeInitialized){
                await userLoggedInCallback();
            }
            return;
     }
     const unsubscribe = auth.onAuthStateChanged(async (user : User | null) => {
        userLoaded = true;
        unsubscribe();
        resolve(user);

        if (user != null) { // Fires only when user logs in
            await userLoggedInCallback();
        }
     }, reject);
  });
}

//auth.onAuthStateChanged(async () => {
//    if (!!auth.currentUser){
//        await userLoggedInCallback();
//    }
//})

/**
 * Things you do when the user logs in, no matter which method
 */
async function userLoggedInCallback(){
    //Should be done without await maybe for asynchronous running
    const store = useSessionStore();
    let lang = await store.initializeLanguage();

    await store.initializeFavorites();

    await store.initializePublications();
    const pubIds = Array.from(store.publications.keys());

    await store.initializeArticles(pubIds);
    let authorIds = [...new Set(Array.from(store.articles.values()).map(x => x.authorId))];

    await store.initializeAuthors(authorIds);
    await store.intitializeArticleNumberLookup();

    await store.intitializeProducts();
    await store.intitializeStripeService();

    store.sessionInitialized = true;
    storeInitialized = true;
}

export async function updateUser(displayName : string = auth.currentUser?.displayName ?? "", photoURL : string = auth.currentUser?.photoURL ?? ""): Promise<boolean> {

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

export async function logOut(){
    await signOut(auth);
}

async function setPersistence(rememberMe : boolean = false){
    if (rememberMe)
        return await auth.setPersistence(browserLocalPersistence);

    await auth.setPersistence(browserSessionPersistence);
}

export async function resetPassword(oldPassword: string, password: string) : Promise<boolean> {
    const user = await getCurrentUserPromise();

    if (user == null) return false
 
    try {
        await updatePassword(user, password);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
   
}