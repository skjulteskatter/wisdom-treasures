import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'
import i18n from '@/i18n'
import type { sessionType } from '@/@types/sessionTypes'
import { auth } from '@/services/auth'

export const useSessionStore = defineStore('session', {
    state: ()=> {
        return {
            //When store is created take languge from i18n if it exist
            locale: i18n.global.locale ?? "en",
            bearer: "",
            sessionStates: {} as {[key: string]: boolean}
        }
    },
    actions: {
        async setLocale(locale = "en"){
            if (await setLocaleFromSessionStore(locale)) this.locale = locale;
        },
        setSessionType(key: sessionType, value: boolean){
            this.sessionStates[key] = value;
        }
    },
    getters: {
        userEmail(){
            return auth.currentUser?.email ?? null;
        },
        userdisplayName(){
            return auth.currentUser?.displayName ?? null;
        },
        userPhotoURL(){
            return auth.currentUser?.photoURL ?? null;
        },
        userEmailVerified(){
            return auth.currentUser?.emailVerified?? false;
        },
        async userToken() : Promise<string>{
            return await auth.currentUser?.getIdToken() ?? "";
        }
    }
})