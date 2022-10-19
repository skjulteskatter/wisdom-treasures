import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'
import i18n from '@/i18n'
import { auth } from '@/services/auth'

export const useSessionStore = defineStore('session', {
    state: ()=> {
        return {
            //When store is created take languge from i18n if it exist
            locale: i18n.global.locale ?? "en",
        }
    },
    actions: {
        async setLocale(locale = "en"){
            if (await setLocaleFromSessionStore(locale)) this.locale = locale;
        },
    },
    getters: {
    }
})