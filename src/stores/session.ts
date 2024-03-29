import { defineStore } from 'pinia'
import {fallbackLocale, setLocaleFromSessionStore, validLanguages} from '@/i18n'
import i18n from '@/i18n'
import type { InlineNotification } from '@/classes/notification'
import { articles, audioClips, authors, favorites as favoritesApi, origins, publications, stripe} from '@/services/api'
import type {Article, Contributor, Publication } from 'hiddentreasures-js'
import { reactive, shallowRef } from 'vue'
import type { Manna } from '@/classes/manna'
import { dbPromises, putArticles, putAuthors, putPublications, putOrigins, putAudioClips } from '@/services/cache'
import { language, favorites, lastUpdated, lastUserHasSubscription } from '@/services/localStorage'
import Fuse from 'fuse.js'
import type { IApiProduct } from '@/Interfaces/IApiProduct'
import StripeService from '@/services/stripe'
import type { Origin } from '@/classes/Origin'
import { auth } from '@/services/auth'
import type { AudioClip } from '@/classes/AudioClip'
import { enableAudioClips, log } from '@/services/env'

export const WISDOM_WORDS_ID : string = "aa7d92e3-c92f-41f8-87a1-333375125a1c";
export const WT_PRODUCT_ID : string = "prod_NnqNtVfJjpCCOy";
export const STRIPE_MANAGE_LINK : string = "https://billing.stripe.com/p/login/aEUaG25ag6bybEA3cc";

export const useSessionStore = defineStore('session', {
    state: ()=> {
        return {
            // When store is created take language from i18n if it exist
            locale: i18n.global.locale ?? fallbackLocale,
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
            articlesInitialized: false as boolean,

            stripeService: undefined as StripeService | undefined,

            mannaHistory: [] as Manna[],

            publicationIdSearchFilter: [] as string[],
            onlyFavoriteSearchFilter: false as boolean,
            authorIdSearchFilter: [] as string[],
            originIdSearchFilter: [] as string[],
            audioClipIdSearchFilter: [] as string[],

            syncSearchFilter: 0 as number,

            searchWord: "" as string,
            serachEvent: false as boolean,

            userHasSubscription: undefined as boolean | undefined,

            currentAudioPlayingId: "" as string,

            userLoggedInCallbackHasbeenCalled: false as boolean,
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
                oldPublicationArray = await (await dbPromises[this.locale]).getAll('publications');
            }

            for (const publication of oldPublicationArray) {
                this.publications.set(publication.id, publication);
            }

            //Get latest date
            const latestUpdatedPublication = oldPublicationArray.length > 0 ? +(lastUpdated.get("publications", this.locale) || "0") : 0;

            try {
                const newPublicationArray: Publication[] = await publications.post(this.locale, new Date(latestUpdatedPublication), 0);
                
                for (const publication of newPublicationArray) {
                    this.publications.set(publication.id, publication);
                }

                await putPublications(newPublicationArray, this.locale);

                lastUpdated.setOrReplace(Date.now(), "publications", this.locale);
            } catch (e){
                log && console.log("couldn't get new publications");
            }

            const option = {
                keys: ['title', 'id', 'description'],
                includeScore: true,
                threshold: 0.3
            }

            this.fusePublications = new Fuse(Array.from(this.publications.values()), option, Fuse.createIndex(option.keys, Array.from(this.publications.values())));
            const timeTaken = Date.now() - start;
            log && console.log("Initialized Publications, Total time taken : " + timeTaken/1000 + " seconds");
        },
        async initializeAuthors(authorIds: string[] | undefined = undefined) {
            this.authors = new Map();
            const start = Date.now()
            let oldAuthorArray: Contributor[] = [];

            oldAuthorArray = await (await dbPromises[this.locale]).getAll('authors');
            
            for (const author of oldAuthorArray) {
                this.authors.set(author.id, author);
            }

            //Get latest date
            const latestUpdatedAuthor = oldAuthorArray.length > 0 ? +(lastUpdated.get("authors", this.locale) || "0") : 0;

            authorIds = authorIds ?? Array.from(this.articles.values()).map(x => x.authorId);
            if (authorIds.length == 0) return;

            try{
                const newAuthorsArray: Contributor[] = await authors.post(this.locale, new Date(latestUpdatedAuthor), 0, authorIds);
                
                for (const author of newAuthorsArray) {
                    this.authors.set(author.id, author);
                }

                await putAuthors(newAuthorsArray, this.locale);

                lastUpdated.setOrReplace(Date.now(), "authors", this.locale);
            } catch (e){
                log && console.log("couldn't get new authors");
            }

            const option = {
                keys: ['name', 'id', 'subtitle', 'biography'],
                includeScore: true,
                threshold: 0.3,
            }
            this.fuseAuthors = new Fuse(Array.from(this.authors.values()), option, Fuse.createIndex(option.keys, Array.from(this.authors.values())));
            const timeTaken = Date.now() - start;
            log && console.log("Initialized Authors, Total time taken : " + timeTaken/1000 + " seconds");
        },
        async initializeSources(fromIndexDb: boolean = true) {
            this.origins = new Map();
            let oldOriginArray: Origin[] = [];

            if (fromIndexDb){
                oldOriginArray = await (await dbPromises[this.locale]).getAll('origins');
            }
            
            for (const origin of oldOriginArray) {
                this.origins.set(origin.id, origin);
            }

            //Get latest date
            const latestUpdatedOrigin = oldOriginArray.length > 0 ? +(lastUpdated.get("origins", this.locale) || "0") : 0;

            try{
                const newOriginssArray: Origin[] = await origins.post(this.locale, new Date(latestUpdatedOrigin), 0);
                
                for (const origin of newOriginssArray) {
                    this.origins.set(origin.id, origin);
                }

                await putOrigins(newOriginssArray, this.locale);

                lastUpdated.setOrReplace(Date.now(), "origins", this.locale);
            } catch (e){
                log && console.log("couldn't get new origins");
            }

            const option = {
                keys: ['name', 'id' ],
                includeScore: true,
                threshold: 0.3,
            }
            this.fuseOrigins = new Fuse(Array.from(this.origins.values()), option, Fuse.createIndex(option.keys, Array.from(this.origins.values())));
        },
        async initializeOldArticles() {
            this.articles = new Map();
            let oldArticlesArray: Article[] = [];

            oldArticlesArray = await (await dbPromises[this.locale]).getAll('articles');
            
            for (const article of oldArticlesArray) {
                this.articles.set(article.id, article);
            }

            await this.initializeAuthors();

            for (const article of oldArticlesArray){
                this.articleNumberLookup.set(article.number, article.id);
            }
        },
        async initializeNewArticles() {
            const start = Date.now();

            //Get latest date
            let latestUpdatedArticle = this.articles.size > 0 ? +(lastUpdated.get("articles", this.locale) || "0") : 0;
            latestUpdatedArticle = latestUpdatedArticle > 0
                ? latestUpdatedArticle
                : (Array.from(this.articles.values()).reduce((oa, u) => Math.max(oa, Date.parse(u.dateWritten)), 0)) + 1; // Get latest date 

            try{

                const paginationInterval = 200;
                let paginationIndex = 0;
                let newArticlesArray: Article[] = [];
                do {

                    newArticlesArray = await articles.post(this.locale, new Date(latestUpdatedArticle), paginationIndex, paginationInterval);

                    const langArrayMap = new Map<string, Article[]>();
                    for (const article of newArticlesArray) {
                        const language = article.content?.language ?? "";
                        if (validLanguages.get(language) === undefined) continue

                        const arr = langArrayMap.get(language) || [];
                        arr.push(article);
                        langArrayMap.set(language, arr);

                        if (language === this.locale) {
                            this.articles.set(article.id, article);
                        }
                    }

                    for (const langArray of langArrayMap){
                        await putArticles(langArray[1], langArray[0]);
                    }

                    await this.initializeAuthors(newArticlesArray.filter(x => !Array.from(this.authors.values()).some(y => y.id == x.authorId)).map(x => x.authorId));

                    for (const article of newArticlesArray){
                        this.articleNumberLookup.set(article.number, article.id);
                    }

                    paginationIndex += paginationInterval;
                } while (newArticlesArray.length >= paginationInterval)

                lastUpdated.setOrReplace(Date.now(), "articles", this.locale);
            } catch (e){
                log && console.log("couldn't get new articles");
            }


            const timeTaken = Date.now() - start;
            log && console.log("Initialized Articles, Total time taken : " + timeTaken/1000 + " seconds");

        },
        async initializeAudioClips(fromIndexDb: boolean = true) {
            
            if (!enableAudioClips) return; // TODO remove this when audioclips are ready

            const start = Date.now();
            this.audioClips = new Map();
            let oldAudioClipsArray: AudioClip[] = [];

            if (fromIndexDb){
                oldAudioClipsArray = await (await dbPromises[this.locale]).getAll('audioclips');
            }

            for (const audioClip of oldAudioClipsArray) {
                this.audioClips.set(audioClip.id, audioClip);
            }

            //Get latest date
            let latestUpdatedAudioClip = oldAudioClipsArray.length > 0 ? +(lastUpdated.get("audioclips", this.locale) || "0") : 0;
            latestUpdatedAudioClip = latestUpdatedAudioClip > 0
                ? latestUpdatedAudioClip
                : (oldAudioClipsArray.reduce((oa, u) => Math.max(oa, Date.parse(u.date)), 0)) + 1; // Get latest date 

            try{
                const newAudioClipsArray: AudioClip[] = await audioClips.post(this.locale, new Date(latestUpdatedAudioClip), 0);
                
                const langAudioClipMap = new Map<string, AudioClip[]>();
                for (const audioClip of newAudioClipsArray) {
                    const language = audioClip.language ?? "";
                    if (audioClip.audioFile == undefined || audioClip.audioFile == null || audioClip.audioFile == "" || validLanguages.get(language) === undefined) continue;

                    const arr = langAudioClipMap.get(language) || [];
                    arr.push(audioClip);
                    langAudioClipMap.set(language, arr);

                    if (language === this.locale) {
                        this.audioClips.set(audioClip.id, audioClip);
                    }
                }

                for (const langArray of langAudioClipMap){
                    await putAudioClips(langArray[1], langArray[0]);
                }

                lastUpdated.setOrReplace(Date.now(), "audioclips", this.locale);
            } catch (e){
                log && console.log("couldn't get new audioclips");
            }

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

            let expieryDate = 0;

            try {
                // Set ex to last subscription expire date
                const wtSubscriptions = (await stripe.getSubscriptions()).filter(x => x.productIds.includes(WT_PRODUCT_ID));
                expieryDate = Math.max(...wtSubscriptions.map(x => { 
                    const date = new Date(x.expireAt);
                    if (!isNaN(date.getTime())) {
                        return date.getTime();
                      } 
                      return 0;
                } ));
                if (expieryDate <= 0){
                    // If user is admin set ex to max. Else 0
                    expieryDate = (await articles.postOneRandom()).length > 0 ? Number.MAX_SAFE_INTEGER : 0;
                } 
                lastUserHasSubscription.setOrReplace(expieryDate);
            } catch
            {
                log && console.log("Failed to get subscriptions");
            } 

            this.userHasSubscription = expieryDate > Date.now();
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
            return await this.setLocale(lang ?? fallbackLocale);
        },
        async resetStore(){
            const lang = language.get();
            return await this.setLocale(lang ?? fallbackLocale);
        }
    },
})