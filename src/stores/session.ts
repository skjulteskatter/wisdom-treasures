import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'
import i18n from '@/i18n'
import type { InlineNotification } from '@/classes/notification'
import { favorites as favoritesApi, stripe} from '@/services/api'
import type {Article, Contributor, Publication, Source } from 'hiddentreasures-js'
import { articleService, publicationService, authorService } from '@/services/publications';
import { reactive, shallowRef } from 'vue'
import type { Manna } from '@/classes/manna'
import { dbPromise, putArticles, putAuthors, putPublications, putOrigins } from '@/services/cache'
import type { HTUser } from '@/classes/HTUser'
import { language, favorites } from '@/services/localStorage'
import Fuse from 'fuse.js'
import type { IApiProduct } from '@/Interfaces/IApiProduct'
import StripeService from '@/services/stripe'
import sourceService from '@/services/publications/sourceService'
import { Origin } from '@/classes/Origin'

const WISDOM_WORDS_ID : string = "aa7d92e3-c92f-41f8-87a1-333375125a1c";

export const useSessionStore = defineStore('session', {
    state: ()=> {
        return {
            // When store is created take language from i18n if it exist
            locale: i18n.global.locale ?? "en",
            // The name of the page to redirect to if trying to reach restricted to auth site when not logged in
            redirectAfterLoginName: "",
            // The login form to start from when pushing from another view.
            loginFormBridge: "login" as "login" | "register" | "forgotPassword",
            // Global variable to close any active modal. For example when clicking the navbar: close every modal
            globalCloseModal: false,
            // The users notifications
            notifications: [] as InlineNotification[],
            //Favorites. GUID's of favorites stored as strings
            favorites: [] as string[],

            publications: shallowRef(new Map) as unknown as Map<string, Publication>,
            fusePublications: undefined as Fuse<Publication> | undefined,

            articles: shallowRef(new Map) as unknown as Map<string, Article>,
            fuseArticles: undefined as Fuse<Article> | undefined,

            authors: shallowRef(new Map) as unknown as Map<string, Contributor>,
            fuseAuthors: undefined as Fuse<Contributor> | undefined,

            origins: shallowRef(new Map) as unknown as Map<string, Origin>,
            fuseOrigins: undefined as Fuse<Origin> | undefined,

            collectionId: "" as string,

            apiProducts: [] as IApiProduct[],

            //Used to look up the id to the article number
            articleNumberLookup: reactive(new Map) as Map<number, string>,

            sessionInitialized: false as boolean,

            stripeService: undefined as StripeService | undefined,

            mannaHistory: [] as Manna[],
            //Not used
            HTUser: null as HTUser | null,

            publicationIdSearchFilter: [] as string[],
            onlyFavoriteSearchFilter: false as boolean,
            authorIdSearchFilter: [] as string[],
            originIdSearchFilter: [] as string[],

            syncSearchFilter: 0 as number,

            searchWord: "" as string,
            serachEvent: false as boolean,

            userHasSubscription: false as boolean,
        }
    },
    actions: {
        async setLocale(locale = "en") : Promise<string> {
            if (await setLocaleFromSessionStore(locale)) {
                this.locale = locale;
                language.setOrReplace(locale);
                return locale;
            }
            return "en";
        },
        addFavorite(ids: string[]): void {
            favoritesApi.add(ids);
            ids.forEach(id => {
                favorites.addOrReplace(id);
            });
            for (const id of ids)
            {
                if (this.favorites.includes(id)) continue;
                this.favorites.push(id);
            }
        },
        removeFavorite(ids: string[]): void {
            favoritesApi.delete(ids);
            ids.forEach(id => {
                favorites.delete(id);
            });
            for (let i = this.favorites.length-1; i >= 0; i--)
            {
                if (!ids.includes(this.favorites[i])) continue;
                this.favorites.splice(i, 1);
            }
        },
        async initializePublications(fromIndexDb: boolean = true){
            let publicationArray: Publication[] = [];
            let retrievedFromIndexDb = true;

            if (fromIndexDb) {
                publicationArray = await (await dbPromise).getAll('publications');
            }

            if (publicationArray.length <= 0) {
                publicationArray = await publicationService.retrieve({parentIds: [WISDOM_WORDS_ID]});
                retrievedFromIndexDb = false;
            }
                
            for (const publication of publicationArray) {
                this.publications.set(publication.id, publication);
            }

            if (!retrievedFromIndexDb){
                await putPublications(publicationArray);
            }

            this.collectionId = publicationArray[0]?.collectionId ?? "";

            const option = {
                keys: ['title', 'id', 'description'],
                includeScore: true,
                threshold: 0.3
            }
            this.fusePublications = new Fuse(publicationArray, option, Fuse.createIndex(option.keys, publicationArray));

        },
        async initializeAuthors(ids : string[], fromIndexDb: boolean = true) {

            if (ids.length <= 0) return;

            let authorArray: Contributor[] = [];
            let retrievedFromIndexDb = true;

            if (fromIndexDb){
                authorArray = await (await dbPromise).getAll('authors');
            }
            
            if (authorArray.length <= 0) {
                authorArray = (await authorService.retrieve({itemIds: ids}));
                retrievedFromIndexDb = false;
            }

            for (const author of authorArray) {
                this.authors.set(author.id, author);
            }

            if (!retrievedFromIndexDb) {
                await putAuthors(authorArray);
            }

            const option = {
                keys: ['name', 'id', 'subtitle', 'biography'],
                includeScore: true,
                threshold: 0.3,
            }
            this.fuseAuthors = new Fuse(authorArray, option, Fuse.createIndex(option.keys, authorArray));

        },
        async initializeSources(ids : string[], fromIndexDb: boolean = true) {

            //Add a check to make sure you're not getting the same 
            if (ids.length <= 0) return;

            let originArray: Origin[] = [];
            let retrievedFromIndexDb = true;

            if (fromIndexDb){
                originArray = await (await dbPromise).getAll('origins');
            }
            
            if (originArray.length <= 0) {
                originArray = (await sourceService.retrieve({itemIds: ids})).map(x => new Origin(x));
                retrievedFromIndexDb = false;
            }

            for (const origin of originArray) {
                this.origins.set(origin.id, origin);
            }

            if (!retrievedFromIndexDb) {
                await putOrigins(originArray); //Try to not await this
            }

            const option = {
                keys: ['name', 'id' ],
                includeScore: true,
                threshold: 0.3,
            }
            this.fuseOrigins = new Fuse(originArray, option, Fuse.createIndex(option.keys, originArray));
        },
        async initializeArticles(ids : string[], fromIndexDb: boolean = true) {

            if (ids.length <= 0) return;
            
            let articlesArray: Article[] = [];
            let retrievedFromIndexDb = true;

            if (fromIndexDb){
                articlesArray = await (await dbPromise).getAll('articles');
            }

            const options = {
                withContent: true,
                parentIds: ids,
            };

            if (articlesArray.length <= 0){
                articlesArray = (await articleService.retrieve(options));
                retrievedFromIndexDb = false;
            }
                            
            for (const article of articlesArray) {
                /*This is the point where we know the user have a subscription*/ this.userHasSubscription = true; 
                this.articles.set(article.id, article);
            }

            if (!retrievedFromIndexDb){
                await putArticles(articlesArray);
            }

            const option = {
                keys: ['content.content', 'dateWritten', 'number', 'id', 'publicationId', 'authorId'],
                includeScore: true,
                threshold: 0.3
            };
            this.fuseArticles = new Fuse(articlesArray, option, Fuse.createIndex(option.keys, articlesArray));

            //OK TEST TEST TEST
            //const langs: (string | undefined)[] = [];
            //console.log(articlesArray.filter(x => x.number == 5549)[0]);
        },
        async initializeFavorites() {
            try {
                this.favorites = await favoritesApi.get();
                favorites.deleteAll();
                for (const key of this.favorites) {
                    favorites.addOrReplace(key);
                }
            }
            catch 
            {
                console.log("Failed to get favorites");
                for (const key of favorites.getAll().keys()) {
                    this.favorites.push(key);
                }
            }
        },
        async intitializeArticleNumberLookup(){
            for (const [key,value] of this.articles){
                this.articleNumberLookup.set(value.number, key);
            }
        },
        async intitializeProducts(){
            try {
                this.apiProducts = await stripe.getProducts();
            } catch
            {
                console.log("Failed to get products");
            }
            
        },
        async intitializeStripeService(){
            try {
                this.stripeService = new StripeService((await stripe.setup()).key);
            } catch {
                console.log("Failed to set up stripe service");
            }
        },
        async initializeLanguage(): Promise<string>{
            const lang = language.get();
            return await this.setLocale(lang ?? undefined);
        }
    },
})