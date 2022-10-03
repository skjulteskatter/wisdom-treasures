import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'
import i18n from '@/i18n'
import type { sessionType } from '@/@types/sessionTypes'

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
        
    }
})