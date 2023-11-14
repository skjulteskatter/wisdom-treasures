/* eslint-disable no-console */
import { initializeApp } from "firebase/app";
import { 
    createUserWithEmailAndPassword, 
    getAuth, 
    GoogleAuthProvider, 
    OAuthProvider, 
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
import { log } from '@/services/env'

export const firebaseApp = initializeApp(config.firebaseConfig);

export const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

//Configure providers
export const googleAuthProvider = new GoogleAuthProvider();
export const appleAuthProvider = new OAuthProvider("apple.com");
appleAuthProvider.addScope("email");
appleAuthProvider.addScope("name");


export async function loginWithEmailAndPassword(email: string, password: string, rememberMe: boolean): Promise<boolean> {
    await setPersistence(rememberMe);

    const userCredentials : UserCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredentials.user.emailVerified){
        await sendEmailVerification(userCredentials.user);
        return false;
    }
    
    pushToDashboardOrRedirectLink();
    return true;
}

export function pushToDashboardOrRedirectLink(){
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
export function getCurrentUserPromise(): Promise<User | null> {

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const store = useSessionStore();
    if (userLoaded) {
        resolve(auth.currentUser);
        if (!store.userLoggedInCallbackHasbeenCalled){
            log && console.log("getCurrentUserPromise: Initializing store");
            await userLoggedInCallback();
        } else {
            log && console.log("getCurrentUserPromise: Store alreday init");
        }
        return;
    }
    const unsubscribe = auth.onAuthStateChanged(async (user : User | null) => {
       log && console.log("Inside onAuthStateChanges promise");
       userLoaded = true;
       unsubscribe();
       resolve(user);

       if (user != null) { // Fires only when user logs in
           log && console.log("Lets init store");
           store.userLoggedInCallbackHasbeenCalled || await userLoggedInCallback();
       }
    }, reject);
  });
}

/**
 * Things you do when the user logs in
 */
export async function userLoggedInCallback(lang: string | undefined = undefined){
    const store = useSessionStore();
    store.userLoggedInCallbackHasbeenCalled = true;
    //Should be done without await maybe for asynchronous running
    log && console.log("callback")

    if (lang == undefined)
        await store.initializeLanguage();

    log && console.log("UserLoggedInCallback: Getting ready to initialize! What is user status: ", auth.currentUser);
    if (auth.currentUser == null) 
    {
        store.userLoggedInCallbackHasbeenCalled = false;
        return;
    }

    const withoutSubscription = [
        store.intitializeStripeService(),
        store.initializeProducts()
    ];

    const withSubscription = [
        store.initializeFavorites(),
        store.initializePublications(),
        store.initializeAudioClips(),
        store.initializeSources(),
        store.initializeOldArticles(),
    ];

    if (await store.userHasSubscriptionPromise() == false){
        log && console.log('UserLoggedInCallback: Store initialized, no subscription')
        await Promise.all(withoutSubscription);
        store.sessionInitialized = true;
        return;
    }
    
    await Promise.all(withoutSubscription.concat(withSubscription));

    store.sessionInitialized = true;
    await store.initializeNewArticles();
    store.articlesInitialized = true;
    log && console.log('UserLoggedInCallback: Store initialized, subscription');
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

export async function loginWithProvider(providerName : string) {

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

    log && console.log("Success!", userCredentials);

    pushToDashboardOrRedirectLink();
}

export async function logOut(){
    const store = useSessionStore();
    store.reset()
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
        log && console.log(e);
        return false;
    }
}