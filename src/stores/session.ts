import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'
import i18n from '@/i18n'
import type { Notification } from '@/classes/notification'
import { favorites as favoritesApi} from '@/services/api'
import type { Article, Publication } from 'hiddentreasures-js'
import { articleService, publicationService } from '@/services/publications';
import { reactive } from 'vue'
import { getCurrentUserPromise } from '@/services/auth'

const WISDOM_WORDS_ID : string = "aa7d92e3-c92f-41f8-87a1-333375125a1c";

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

            publications: reactive(new Map) as Map<string, Publication>,

            articles: reactive(new Map) as Map<string, Article>,
            //Used to look up the id to the article number
            articleNumberLookup: reactive(new Map) as Map<number, string>,

            sessionInitialized: false as boolean,
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
        async getPublications() : Promise<Map<string, Publication>>{
            if (this.publications.size <= 0) {
                const publicationArray: Publication[] = await publicationService.retrieve({
                    parentIds: [WISDOM_WORDS_ID],
                });
                for (const publication of publicationArray) {
                    this.publications.set(publication.id, publication);
                }
            }
            return this.publications;
        },
        async initializeArticles(ids : string[]) {

            const options = {
                withContent: true,
                parentIds: ids,
            };

            const articlesArray: Article[] = (await articleService.retrieve(options));
            for (const article of articlesArray) {
                this.articles.set(article.id, article);
            }
        },
        async intitializeArticleNumberLookup(){
            for (const [key,value] of this.articles){
                this.articleNumberLookup.set(value.number, key);
            }
        }
    },
})