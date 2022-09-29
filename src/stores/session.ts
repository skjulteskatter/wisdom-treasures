import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'

export const useSessionStore = defineStore('session', {
    state: ()=> {
        return {
            locale: "en",
            bearer: "",
        }
    },
    actions: {
        async setLocale(locale = "en"){
            if (await setLocaleFromSessionStore(locale)) this.locale = locale;
        }
    },
    getters: {
        
    }
})