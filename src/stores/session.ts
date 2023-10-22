import { defineStore } from 'pinia'
import {setLocaleFromSessionStore} from '@/i18n'
import i18n from '@/i18n'
import type { InlineNotification } from '@/classes/notification'
import { articles, audioClips, authors, favorites as favoritesApi, origins, publications, stripe} from '@/services/api'
import type {Article, Contributor, Publication } from 'hiddentreasures-js'
import { reactive, shallowRef } from 'vue'
import type { Manna } from '@/classes/manna'
import { dbPromise, putArticles, putAuthors, putPublications, putOrigins, putAudioClips } from '@/services/cache'
import type { HTUser } from '@/classes/HTUser'
import { language, favorites, lastUpdated, lastUserHasSubscription } from '@/services/localStorage'
import Fuse from 'fuse.js'
import type { IApiProduct } from '@/Interfaces/IApiProduct'
import StripeService from '@/services/stripe'
import type { Origin } from '@/classes/Origin'
import { auth } from '@/services/auth'
import type { AudioClip } from '@/classes/AudioClip'
import { log } from '@/services/logger'

export const WISDOM_WORDS_ID : string = "aa7d92e3-c92f-41f8-87a1-333375125a1c";
export const WT_PRODUCT_ID : string = "prod_NnqNtVfJjpCCOy";
export const STRIPE_MANAGE_LINK : string = "https://billing.stripe.com/p/login/aEUaG25ag6bybEA3cc";

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

            authors: shallowRef(new Map) as unknown as Map<string, Contributor>,
            fuseAuthors: undefined as Fuse<Contributor> | undefined,

            origins: shallowRef(new Map) as unknown as Map<string, Origin>,
            fuseOrigins: undefined as Fuse<Origin> | undefined,

            audioClips: shallowRef(new Map) as unknown as Map<string, AudioClip>,

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
            audioClipIdSearchFilter: [] as string[],

            syncSearchFilter: 0 as number,

            searchWord: "" as string,
            serachEvent: false as boolean,

            userHasSubscription: undefined as boolean | undefined,

            latestUpdatedArticle: 0 as number,
            latestUpdatedAuthor: 0 as number,
            latestUpdatedPublication: 0 as number,
            latestUpdatedOrigin: 0 as number,
            latestUpdatedAudioClip: 0 as number,

            currentAudioPlayingId: "" as string,
        }
    },
    actions: {
        reset() {
            // call reset to reset the store state
            this.$reset();
            log && console.log('Session status', this.sessionInitialized)
         },
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
            const start = Date.now()
            let oldPublicationArray: Publication[] = [];

            if (fromIndexDb) {
                oldPublicationArray = await (await dbPromise).getAll('publications');
            }

            for (const publication of oldPublicationArray) {
                this.publications.set(publication.id, publication);
            }

            //Get latest date
            this.latestUpdatedPublication = oldPublicationArray.length > 0 ? +(lastUpdated.get("publications") || "0") : 0;

            const newPublicationArray: Publication[] = await publications.post(this.locale, new Date(this.latestUpdatedPublication), 0);
            
            for (const publication of newPublicationArray) {
                this.publications.set(publication.id, publication);
            }

            await putPublications(newPublicationArray);

            lastUpdated.setOrReplace(Date.now(), "publications");

            const option = {
                keys: ['title', 'id', 'description'],
                includeScore: true,
                threshold: 0.3
            }

            this.fusePublications = new Fuse(oldPublicationArray.concat(newPublicationArray), option, Fuse.createIndex(option.keys, oldPublicationArray.concat(newPublicationArray)));
            const timeTaken = Date.now() - start;
            log && console.log("Initialized Publications, Total time taken : " + timeTaken/1000 + " seconds");
        },
        async initializeAuthors(fromIndexDb: boolean = true) {
            const start = Date.now()
            let oldAuthorArray: Contributor[] = [];

            if (fromIndexDb){
                oldAuthorArray = await (await dbPromise).getAll('authors');
            }
            
            for (const author of oldAuthorArray) {
                this.authors.set(author.id, author);
            }

            //Get latest date
            this.latestUpdatedAuthor = oldAuthorArray.length > 0 ? +(lastUpdated.get("authors") || "0") : 0;

            const authorIdsFromArticles = Array.from(this.articles.values()).map(x => x.authorId);

            const newAuthorsArray: Contributor[] = await authors.post(this.locale, new Date(this.latestUpdatedAuthor), 0, authorIdsFromArticles);
            
            for (const author of newAuthorsArray) {
                this.authors.set(author.id, author);
            }

            await putAuthors(newAuthorsArray);

            lastUpdated.setOrReplace(Date.now(), "authors");

            const option = {
                keys: ['name', 'id', 'subtitle', 'biography'],
                includeScore: true,
                threshold: 0.3,
            }
            this.fuseAuthors = new Fuse(oldAuthorArray.concat(newAuthorsArray), option, Fuse.createIndex(option.keys, oldAuthorArray.concat(newAuthorsArray)));
            const timeTaken = Date.now() - start;
            log && console.log("Initialized Authors, Total time taken : " + timeTaken/1000 + " seconds");
        },
        async initializeSources(fromIndexDb: boolean = true) {

            let oldOriginArray: Origin[] = [];

            if (fromIndexDb){
                oldOriginArray = await (await dbPromise).getAll('origins');
            }
            
            for (const origin of oldOriginArray) {
                this.origins.set(origin.id, origin);
            }

            //Get latest date
            this.latestUpdatedOrigin = oldOriginArray.length > 0 ? +(lastUpdated.get("origins") || "0") : 0;

            const newOriginssArray: Origin[] = await origins.post(this.locale, new Date(this.latestUpdatedOrigin), 0);
            
            for (const origin of newOriginssArray) {
                this.origins.set(origin.id, origin);
            }

            await putOrigins(newOriginssArray);

            lastUpdated.setOrReplace(Date.now(), "origins");

            const option = {
                keys: ['name', 'id' ],
                includeScore: true,
                threshold: 0.3,
            }
            this.fuseOrigins = new Fuse(oldOriginArray.concat(newOriginssArray), option, Fuse.createIndex(option.keys, oldOriginArray.concat(newOriginssArray)));
        },
        async initializeArticles(fromIndexDb: boolean = true) {
            const start = Date.now();
            let oldArticlesArray: Article[] = [];

            if (fromIndexDb){
                oldArticlesArray = await (await dbPromise).getAll('articles');
            }

            for (const article of oldArticlesArray) {
                this.articles.set(article.id, article);
            }

            //Get latest date
            this.latestUpdatedArticle = oldArticlesArray.length > 0 ? +(lastUpdated.get("articles") || "0") : 0;
            this.latestUpdatedArticle = this.latestUpdatedArticle > 0
                ? this.latestUpdatedArticle
                : (oldArticlesArray.reduce((oa, u) => Math.max(oa, Date.parse(u.dateWritten)), 0)) + 1; // Get latest date 

            const newArticlesArray: Article[] = await articles.post(this.locale, new Date(this.latestUpdatedArticle), 0);
            
            for (const article of newArticlesArray) {
                this.articles.set(article.id, article);
            }

            await putArticles(newArticlesArray);

            lastUpdated.setOrReplace(Date.now(), "articles");


            const timeTaken = Date.now() - start;
            log && console.log("Initialized Articles, Total time taken : " + timeTaken/1000 + " seconds");

        },
        async initializeAudioClips(fromIndexDb: boolean = true) {
            const start = Date.now();
            let oldAudioClipsArray: AudioClip[] = [];

            if (fromIndexDb){
                oldAudioClipsArray = await (await dbPromise).getAll('audioclips');
            }

            for (const audioClip of oldAudioClipsArray) {
                this.audioClips.set(audioClip.id, audioClip);
            }

            //Get latest date
            this.latestUpdatedAudioClip = oldAudioClipsArray.length > 0 ? +(lastUpdated.get("audioclips") || "0") : 0;
            this.latestUpdatedAudioClip = this.latestUpdatedAudioClip > 0
                ? this.latestUpdatedAudioClip
                : (oldAudioClipsArray.reduce((oa, u) => Math.max(oa, Date.parse(u.date)), 0)) + 1; // Get latest date 

            const newAudioClipsArray: AudioClip[] = await audioClips.post(this.locale, new Date(this.latestUpdatedAudioClip), 0);
            
            for (const audioClip of newAudioClipsArray) {
                if (audioClip.audioFile == undefined || audioClip.audioFile == null || audioClip.audioFile == "") continue;
                this.audioClips.set(audioClip.id, audioClip);
            }

            await putAudioClips(newAudioClipsArray);

            lastUpdated.setOrReplace(Date.now(), "audioclips");

            const timeTaken = Date.now() - start;
            log && console.log("Initialized AudioClips, Total time taken : " + timeTaken/1000 + " seconds");

        },
        async initializeFavorites() {
            try {
                const start = Date.now();
                this.favorites = await favoritesApi.get();
                favorites.deleteAll();
                for (const key of this.favorites) {
                    favorites.addOrReplace(key);
                }
                const timeTaken = Date.now() - start;
                log && console.log("Initialized Favorites, Total time taken : " + timeTaken/1000 + " seconds");
            }
            catch 
            {
                log && console.log("Failed to get favorites online");
                for (const key of favorites.getAll().keys()) {
                    this.favorites.push(key);
                }
            }
        },
        async intitializeArticleNumberLookup(){
            const start = Date.now()
            for (const [key,value] of this.articles){
                this.articleNumberLookup.set(value.number, key);
            }
            const timeTaken = Date.now() - start;
            log && console.log("Initialized Articlenumberlookup, Total time taken : " + timeTaken/1000 + " seconds");
        },
        async initializeProducts(){
            try {
                const start = Date.now()
                this.apiProducts = await stripe.getProducts();
                const timeTaken = Date.now() - start;
                log && console.log("Initialized Products, Total time taken : " + timeTaken/1000 + " seconds");
            } catch
            {
                log && console.log("Failed to get products");
            }
            
        },
        async userHasSubscriptionPromise() : Promise<boolean>{
            if (this.userHasSubscription !== undefined) {
                return this.userHasSubscription;
            }
            
            if (auth.currentUser == null) 
            {
                log && console.log("Can't get subs if you're not logged in 😅");
                return false;
            }

            try {
                this.userHasSubscription = (await stripe.getSubscriptions()).some(x => x.productIds.includes(WT_PRODUCT_ID) && x.expired === false);
                if (this.userHasSubscription === false){
                    this.userHasSubscription = (await articles.postOneRandom()).length > 0;
                    if (this.userHasSubscription) log && console.log("Ahh your the admin");
                } else if (this.userHasSubscription === undefined){
                    this.userHasSubscription = lastUserHasSubscription.get();
                }
            } catch
            {
                log && console.log("Failed to get subscriptions");
                this.userHasSubscription = lastUserHasSubscription.get();
            } 

            lastUserHasSubscription.setOrReplace(this.userHasSubscription);
            return this.userHasSubscription;
        },
        async intitializeStripeService(){
            try {
                const start = Date.now()
                this.stripeService = new StripeService((await stripe.setup()).key);
                const timeTaken = Date.now() - start;
                log && console.log("Initialized Stripe service, Total time taken : " + timeTaken/1000 + " seconds");
            } catch {
                log && console.log("Failed to set up stripe service");
            }
        },
        async initializeLanguage(): Promise<string>{
            const lang = language.get();
            return await this.setLocale(lang ?? undefined);
        }
    },
})