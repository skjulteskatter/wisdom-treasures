<template>
  <main>
    <div class="flex bg-[color:var(--wt-c-white-soft)] sm:bg-transparent items-center shadow-md sm:shadow-none z-40 max-h-16 sm:h-auto w-full absolute top-0 left-0 sm:static px-6 sm:px-0 ">
      <h1 class="text-base my-4 sm:text-xl font-bold text-[color:var(--wt-color-text-grey)]">
        <span v-if="currentUser" class="sm:font-bold">
          {{ $t('welcome')}},&nbsp
          <span class="animated-gradient font-bold cursor-pointer" @click="$router.push({name: 'profile'})">
            {{currentUser.displayName}}
          </span>
        </span>
        <span v-else class="font-bold"> 
          Welcome to 
          <span class="animated-gradient font-bold">
            WisdomTreasures
          </span>
        </span>
      </h1>
    </div>

    <div id="wordOfTheDayCotainer" class="flex flex-col justify-between mt-20 sm:mt-5 mb-0 md:mb-5 px-4 sm:px-0 pb-8 sm:pb-5">
      <div class="flex col-span-3">
        <div class="sm:hidden flex flex-col w-1/2 justify-center -ml-12 ">
          <p class="sideMenuBtn -rotate-90 font-bold tracking-075 w-full mb-12 cursor-pointer" :class="{'sideMenuBtnActive' : displayWordOfTheDay}" @click="changeDisplayWOTD()">Daily word<div v-if="displayWordOfTheDay" class="border-b-2 border-[color:var(--wt-color-secondary-light)] w-28 h-1/3"></div></p>
          <p class="sideMenuBtn -rotate-90 font-bold tracking-075 w-full my-20 cursor-pointer" :class="{'sideMenuBtnActive' : displayFavorites}" @click="changeDisplayFavorites()">Favorites<div v-if="displayFavorites" class="border-b-2 border-[color:var(--wt-color-secondary-light)] w-24 h-1/3"></div></p>
          <p class="-rotate-90 text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80 w-full mt-12 mb-10 cursor-pointer" @click="navigate('history')">History</p>
        </div>

        <!-- TO-DO: change so that the wisdom word doesn't change after the button is clicked -->
        <WWShowCard v-if="randomArticle && displayWordOfTheDay" :article="randomArticle" class="w-11/12 sm:w-full -ml-8 sm:m-0" :WWCardHomeView="true" />

        <!-- DIV for favourites -->
        <div v-if="displayFavorites" id="WWCards" class="w-11/12 sm:w-full -ml-8 sm:m-0 h-68vh grid grid-cols-1 gap-2 justify-between overflow-y-auto rounded-lg relative">
          <div class="grid grid-cols-1 gap-2 justify-between overflow-y-auto rounded-lg">
            <div v-for="(article, index) in favoriteArticles" :key="index" class="flex flex-col">
              <WWCard :article="article" @close-modal="refreshDataFavorites" @click="refreshDataFavorites" />
            </div>
          </div>
          <div id="shadowDiv" class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F1F1F1] to-transparent"></div>
        </div>

        <!-- DIV for the history -->
        <!-- <div id="WWCards" class="w-11/12 sm:w-full -ml-8 sm:m-0 h-68vh grid grid-cols-1 gap-2 justify-between overflow-y-auto rounded-lg relative">
          <div class="grid grid-cols-1 gap-2 justify-between overflow-y-auto rounded-lg">

          </div>
          <div id="shadowDiv" class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F1F1F1] to-transparent"></div>
        </div> -->

      </div>
      <div id="bgDiv" class="sm:hidden bg-[#F1F1F1] w-full h-3/4 absolute bottom-0 left-0 -z-50 rounded-t-4xl"></div>
    </div>


      <div class="ml-5 sm:ml-0">
        <h1 class="text-base font-bold tracking-075 my-5 sm:mt-0 text-[color:var(--wt-color-text-grey)] opacity-80">ORIGIN</h1>
        <OriginsSwiper/>
      </div>
      
      <div class="mx-5 sm:mx-0 mb-5">
        <h1 class="text-base font-bold my-5 sm:mt-0 tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">WISDOM MANNA</h1>
        <ThreeDButton size="large" :three-d="true" @clicked="getAndSetRandomArticle" class="self-end flex-shrink-0">
          <p class="text-base font-bold tracking-wide">Get Wisdom Manna</p>
          <template #icon>
            <RefreshIcon class="h-5"/>
          </template>
        </ThreeDButton>
        <WWShowCard v-if="randomArticle" :article="randomArticle" class="w-full mt-5" :WWCardHomeView="false" />
      </div>

  </main>
</template>

<script lang="ts">
import { getCurrentUserPromise } from '@/services/auth';
import type { User } from '@firebase/auth';
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import WWCard from '@/components/WWCard.vue';
import { useSessionStore } from '@/stores/session';
import { Notification } from '@/classes/notification';
import router from '@/router';
import WWShowCard from '@/components/WWShowCard.vue';
import ThreeDButton from '@/components/ThreeDButton.vue';
import { RefreshIcon } from '@heroicons/vue/outline';
import BaseButton from "@/components/BaseButton.vue";
import Loader from '@/components/Loader.vue';
import Origin from '@/components/Origin.vue';
import { mannaHistory } from '@/services/localStorage';
import OriginsSwiper from '@/components/OriginsSwiper.vue';

  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        publications : [] as Publication[],
        currentUser : null as User | null,
        store: useSessionStore(),
        randomArticle : null as Article | null,
        showWordOfTheDay : false as boolean,
        randomArticleList : [] as Article[],
        shuffeledArticleKeys: [] as string[],
        loadingMoreArticles: false as boolean,
        dataFavorites : undefined as string[] | undefined,
        displayFavorites: false as Boolean,
        displayWordOfTheDay: true as Boolean
      }
    },
    components: {
    WWCard,
    WWShowCard,
    ThreeDButton,
    RefreshIcon,
    BaseButton,
    Loader,
    Origin,
    OriginsSwiper
},
    computed: {
      articles() : Article[] {
        const articles = Array.from(this.store.articles.values());
        return articles;
      },
      linkedArticle(): null | Article {

        if (this.homePath === this.currentPath) return null;
        const articleId = this.store.articleNumberLookup.get(this.currentPathNumber || -1);
        if (articleId === undefined) return null;

        if ((this.randomArticleList.some(x => x.id == articleId))) return null;

        const article = this.store.articles.get(articleId || "");
        if (article === undefined) return null;

        return article;
      },
      currentPath() : string {
          return !this.$route.path.endsWith("/") ? this.$route.path : this.$route.path.slice(0 , this.$route.path.length - 1);
      },
      homePath(): string {
        let route = (router.getRoutes().find(x => x.name == 'dashboard')?.path || "⛄");
        return !route.endsWith("/") ? route : route.slice(0 , route.length - 1);
      },
      currentPathNumber() : number | null {
        let match = (this.currentPath.match(/[0-9]+$/) ?? [null])[0];
        if (match == null) return null;
        return parseInt(match);
      },
      sessionInitialized() : boolean {
        return this.store.sessionInitialized;
      },
      storeFavorites() : string[]{
        return this.store.favorites;
      },
      favorites() : string[]{
        return this.dataFavorites === undefined ? this.storeFavorites : this.dataFavorites;
      },
      favoriteArticles() : Article[] {
        const favoriteArticles = [];
        for (const favorite of this.favorites) {
          const article = this.store.articles.get(favorite);
          if (article === null || article === undefined) continue;
          favoriteArticles.push(article);
        }
        return favoriteArticles;
      },
    },
    watch: {
      sessionInitialized(initialized){
        if (initialized) {
          this.checkArticleNumberPath(); 
          this.getAndSetWordOfTheDayArticle();
        }
      }
    },
    async mounted() {
      this.currentUser = await getCurrentUserPromise() as User;
      if (this.sessionInitialized) this.getAndSetWordOfTheDayArticle();

      for (const key of this.store.articles.keys()) {
          this.shuffeledArticleKeys.push(key);
      }
      
      this.fillRandomArticles(20);

      window.addEventListener('scroll', this.onScroll);
    },
    methods:{
      async onScroll(){
        let bottom = window.innerHeight + window.pageYOffset == document.body.scrollHeight;
        if (!bottom) return;
        this.loadingMoreArticles = true;
        setTimeout(() => {
          this.fillRandomArticles(20);
        }, 1);
        setTimeout(() => {
          this.loadingMoreArticles = false;
        }, 200);
      },
      fillRandomArticles(paginationCount : number){
        let shuffeledArticleKeysMax = this.shuffeledArticleKeys.length;
        for (let i = 0; i < Math.min(paginationCount, shuffeledArticleKeysMax); i++) {
          let randomIndex = Math.floor(Math.random() * this.shuffeledArticleKeys.length);
          let randomArticle = (this.store.articles.get(this.shuffeledArticleKeys[randomIndex]))
          if (randomArticle != undefined){
            this.randomArticleList.push(randomArticle);
            this.shuffeledArticleKeys.splice(randomIndex, 1);
          }
        }
      },
      navigate(name: string, e? : Event){

      if (name === "register"){
        //Just to mmake sure the login forms appears as 'register' and not as 'login'
        this.store.loginFormBridge = "register";
        name = "login";
      }
      router.push({name: name});
      },
      articleNotFound(num: number) : void{
        //Should probably navigate back 🤷‍♂️
        this.store.notifications.push(new Notification("Couldn't find article number: " + num.toString(), "error"));
        router.push({name: "dashboard"});
      },
      checkArticleNumberPath(){
        if (this.homePath === this.currentPath) return;

        const articleId = this.store.articleNumberLookup.get(this.currentPathNumber || -1);
        if (articleId === undefined) {
          this.articleNotFound(this.currentPathNumber || NaN);
          return;
        }

        if ((this.articles.some(x => x.id == articleId))) return null;

        if (this.linkedArticle === null) this.articleNotFound(2);
      },
      getAndSetRandomArticle(): void {
        this.randomArticle = this.articles[Math.floor(Math.random()*this.articles.length)] || null;
        mannaHistory.addOrReplace(this.randomArticle.id);
        this.showWordOfTheDay = false;
      },
      getAndSetWordOfTheDayArticle(): void {
        let date : Date = new Date();
        let dateNumber : number = +`${date.getDay()}${date.getMonth()}${date.getFullYear()}999`;
        let randomNumber : number = this.mulberry32(dateNumber);
        let adjustedRandomNumber = Math.round(randomNumber * (this.articles.length - 1));
        if (adjustedRandomNumber < 0 || (adjustedRandomNumber > this.articles.length - 1)) adjustedRandomNumber = 0;
        this.randomArticle = this.articles[adjustedRandomNumber] || null;
        this.showWordOfTheDay = true;
      },
      mulberry32(a : number) : number {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      },
      refreshDataFavorites(){
        this.dataFavorites = [...this.storeFavorites];
      },
      changeDisplayFavorites(){
        this.displayFavorites = true
        this.displayWordOfTheDay = false
        
      },
      changeDisplayWOTD(){
        this.displayWordOfTheDay = true
        this.displayFavorites = false
      }
    },
  });
</script>
<style>
.sideMenuBtn{
  font-size: 1rem;
  color: var(--wt-color-text-grey);
  opacity: 0.8;
  width: 100%;
  transition: all 0.15s;
}
.sideMenuBtn.sideMenuBtnActive{
  font-size: 1.25rem;
  color: var(--wt-color-primary);
  opacity: 0.9
}
.tracking-075{
  letter-spacing:0.075em
}
.rounded-t-4xl{
  border-top-left-radius: 2.5rem; /* 40px */
  border-top-right-radius: 2.5rem; /* 40px */ 
}
.h-68vh{
  height:68vh;
}
@media(min-width:640px){
  .h-68vh{
    height:auto;
  }
}
</style>
