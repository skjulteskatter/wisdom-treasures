import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'
import i18n from '@/i18n'
import type { Notification } from '@/classes/notification'
import { favorites as favoritesApi, session} from '@/services/api'
import type {User, Article, Contributor, Publication, Settings, IUser } from 'hiddentreasures-js'
import { articleService, publicationService, authorService } from '@/services/publications';
import { reactive } from 'vue'
import type { Manna } from '@/classes/manna'
import { dbPromise, putArticles, putAuthors, putPublications } from '@/services/cache'
import type { HTUser } from '@/classes/HTUser'
import { language } from '@/services/localStorage'

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

            authors: reactive(new Map) as Map<string, Contributor>,
            //Used to look up the id to the article number
            articleNumberLookup: reactive(new Map) as Map<number, string>,

            sessionInitialized: false as boolean,

            mannaHistory: [] as Manna[],
            //Not used
            HTUser: null as HTUser | null
        }
    },
    actions: {
        async setLocale(locale = "en") : Promise<string> {
            if (await setLocaleFromSessionStore(locale)) {
                this.locale = locale;
                language.setOrReplace(locale);
                return locale;
            };
            return "en";
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
        async initializePublications(fromIndexDb: boolean = true){

            let publicationArray: Publication[] = [];

            if (fromIndexDb){
                publicationArray = await (await dbPromise).getAll('publications');
            }

            if (publicationArray.length <= 0) 
                publicationArray = await publicationService.retrieve({parentIds: [WISDOM_WORDS_ID]});

            for (const publication of publicationArray) {
                this.publications.set(publication.id, publication);
            }

            await putPublications(publicationArray);
        },
        async initializeAuthors(ids : string[], fromIndexDb: boolean = true) {

            if (ids.length <= 0) return;

            let authorArray: Contributor[] = [];

            if (fromIndexDb){
                authorArray = await (await dbPromise).getAll('authors');
            }
            
            if (authorArray.length <= 0) {
                authorArray = (await authorService.retrieve({itemIds: ids}));
            }

            for (const author of authorArray) {
                this.authors.set(author.id, author);
            }

            await putAuthors(authorArray);
        },
        async initializeArticles(ids : string[], fromIndexDb: boolean = true) {

            if (ids.length <= 0) return;
            
            let articlesArray: Article[] = [];

            if (fromIndexDb){
                articlesArray = await (await dbPromise).getAll('articles');
            }

            const options = {
                withContent: true,
                parentIds: ids,
            };

            if (articlesArray.length <= 0)
                articlesArray = (await articleService.retrieve(options));
            
            for (const article of articlesArray) {
                this.articles.set(article.id, article);
            }

            await putArticles(articlesArray);
        },
        async intitializeArticleNumberLookup(){
            for (const [key,value] of this.articles){
                this.articleNumberLookup.set(value.number, key);
            }
        },
        async initializeLanguage(): Promise<string>{
            let lang = language.get();
            return await this.setLocale(lang ?? undefined);
        }
    },
})