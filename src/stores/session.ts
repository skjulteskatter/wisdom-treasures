import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'
import i18n from '@/i18n'
import type { Notification } from '@/classes/notification'
import { favorites as favoritesApi} from '@/services/api'

export const useSessionStore = defineStore('session', {
    state: ()=> {
        return {
            // When store is created take language from i18n if it exist
            locale: i18n.global.locale ?? "en",
            // The name of the page to redirect to if trying to reach restricted to auth site when not logged in
            redirectAfterLoginName: "",
            // The searchword to automatically search from when pushing to new search view (used in navbar when searching and redirecteing)
            searchWordBridge: "",
            // The login form to start from when pushing from another view.
            loginFormBridge: "login" as "login" | "register" | "forgotPassword",
            // Global variable to close any active modal. For example when clicking the navbar: close every modal
            globalCloseModal: false,
            // The users notifications
            notifications: [] as Notification[],
            //Favorites. GUID's of favorites stored as strings
            favorites: [] as string[],
            //If the favorites is initialiized
        }
    },
    actions: {
        async setLocale(locale = "en"){
            if (await setLocaleFromSessionStore(locale)) this.locale = locale;
        },
        addFavorite(ids: string[]): void {
            favoritesApi.add(ids);
            for (const id of ids)
            {
                if (this.favorites.includes(id)) continue;
                this.favorites.push(id);
            }
        },
        removeFavorite(ids: string[]): void {
            favoritesApi.delete(ids);
            for (let i = this.favorites.length-1; i >= 0; i--)
            {
                if (!ids.includes(this.favorites[i])) continue;
                this.favorites.splice(i, 1);
            }
        },
    },
})