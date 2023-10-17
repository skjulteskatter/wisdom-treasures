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
    signInWithRedirect,
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
    if (!userCredentials.user.emailVerified){
        await sendEmailVerification(userCredentials.user);
        return false;
    }
    
    pushToDashboardOrRedirectLink();
    return true;
}

export async function loginWithProvider(providerName : string, rememberMe: boolean) {

    console.log("trace A");
    await setPersistence(rememberMe);
    console.log("trace B");
    let provider = undefined;
    switch (providerName) {
        case "google":
            console.log("trace C");
            provider = googleAuthProvider;
            break;
        case "apple":
            console.log("trace D");
            provider = appleAuthProvider;
            break;
        default:
            console.log("trace E");
            return;
    }

    console.log("trace F");

    if (getDeviceType() == "desktop"){
        console.log("trace G");
        const userCredentials : UserCredential = await signInWithPopup(auth, provider);
        console.log("trace H");
        console.log("1: ", userCredentials);
    } else {
        try{    
            console.log("trace I");
            const userCredentials : UserCredential = await signInWithPopup(auth, provider);
            console.log("trace J");
            console.log("2: ", userCredentials);
        } catch (e){
            console.log("trace K");
            console.log("Failed to log in with redirect. Trying popup.\nError: " + e);
            const userCredentials : UserCredential = await signInWithPopup(auth, provider);
            console.log("trace L");
            console.log("3: ", userCredentials);
        }
    }
    
    pushToDashboardOrRedirectLink();
}

function pushToDashboardOrRedirectLink(){
    const store = useSessionStore();

    let name = store.$state.redirectAfterLoginName;
    store.$state.redirectAfterLoginName = "";


    name = "" //REMOVE THIS
    if (name.length <= 0)
      name = "emptyDashboard";

    router.push({name: name});
}

export async function signupWithEmailAndPassword(email: string, password: string){
    const userCredentials : UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredentials.user);
}

let storeInitialized = false;
let userLoaded: boolean = false || !!auth.currentUser;
export function getCurrentUserPromise(): Promise<User | null> {

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
     if (userLoaded) {
            resolve(auth.currentUser);
            if (!storeInitialized){
                console.log("getCurrentUserPromise: Initializing store");
                await userLoggedInCallback();
            } else {
                console.log("getCurrentUserPromise: Store alreday init");
            }
            return;
     }
     const unsubscribe = auth.onAuthStateChanged(async (user : User | null) => {
        console.log("Inside onAuthStateChanges promise");
        userLoaded = true;
        unsubscribe();
        resolve(user);

        if (user != null) { // Fires only when user logs in
            console.log("Lets init store");
            await userLoggedInCallback();
        }
     }, reject);
  });
}

export function getDeviceType() : "mobile" | "desktop" | "tablet" | "unknown" {
    let deviceType = "unknown" as "mobile" | "desktop" | "tablet" | "unknown";
    const platform = navigator.platform.toLowerCase();
    if (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform)) {
        deviceType = 'mobile';
    } else if (/mac|win|linux/i.test(platform)) {
        deviceType = 'desktop';
    } else if (/tablet|ipad/i.test(platform)) {
        deviceType = 'tablet';
    } 

    return deviceType
}

/**
 * Things you do when the user logs in, no matter which method
 */
export async function userLoggedInCallback(){
    //Should be done without await maybe for asynchronous running

    return; //REMOVE THIS
    const store = useSessionStore();
    await store.initializeLanguage();

    console.log("UserLoggedInCallback: Getting ready to initialize! What is user status: ", auth.currentUser);
    if (auth.currentUser == null) return;

    if (await store.userHasSubscriptionPromise() == false){
        store.sessionInitialized = true;
        console.log('UserLoggedInCallback: Store initialized, no subscription')
        return
    }
    
    storeInitialized = true;
    await Promise.all([
        store.initializeProducts(),
        store.initializeFavorites(),
        store.initializePublications(),
        store.initializeArticles(),
        store.initializeAudioClips(),
        store.initializeSources(),
        store.intitializeStripeService()
    ]);

    await store.intitializeArticleNumberLookup(),
    await store.initializeAuthors();
    store.sessionInitialized = true;
    console.log('UserLoggedInCallback: Store initialized, subscription')
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
        console.log(e);
        return false;
    }
   
}