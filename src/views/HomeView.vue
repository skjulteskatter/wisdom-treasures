<template>
  <main>
    <div class="flex bg-white sm:bg-transparent items-center shadow-md sm:shadow-none z-40 max-h-16 sm:h-auto w-full fixed top-0 left-0 sm:static px-6 sm:px-0 ">
      <h1 class="text-base my-4 sm:text-xl font-bold">
        <span v-if="currentUser" class="sm:font-bold">
          Welcome, 
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
    <div id="wordOfTheDayCotainer" class="flex flex-col justify-between mt-20 mb-0 md:mb-20 md:grid md:grid-cols-3 grid-cols-1 md:gap-2 px-5 sm:px-0">

        <!-- <div class="sm:hidden absolute bottom-20 -left-20 flex -rotate-90">
          <BaseButton theme="menuButton" @click="navigate('history')">History</BaseButton>
          <BaseButton theme="menuButton" @click="e => navigate('favorites', e)">Favorites</BaseButton>
          <BaseButton theme="menuButton" @click="e => navigate('dashboard', e)">Daily word</BaseButton>
        </div> -->

      <WWShowCard v-if="randomArticle" :article="randomArticle" class="col-span-2" :WWCardHomeView="true" :customTitle="showWordOfTheDay ? 'Word of the day' : ''"/>
        
      <ThreeDButton size="large" :three-d="true" @clicked="getAndSetRandomArticle" class="self-end w-full mt-2 flex-shrink-0 md:mt-0 sm:mx-0 sm:h-full">
        <p class="text-base">Generate new word</p>
        <template #icon>
          <RefreshIcon class="h-5"/>
        </template>
      </ThreeDButton>
    </div>
    <div class="text-xl sm:text-2xl font-bold text-[color:var(--wt-color-text-grey)] mt-10 mx-5 sm:mx-0">Other wisdom words</div>
    <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-5 mx-5 sm:mx-0">
      <div v-for="(article, index) in randomArticleList" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true"/>
      </div>
    </div>
    <div id="loaderDiv">
      <Loader :loading="loadingMoreArticles" class="mt-2"/>
    </div>
    <WWCard id="placeHolderWWforlinkedwords" v-if="linkedArticle !== null" :article="linkedArticle" class="hidden"/>
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
      }
    },
    components: {
      WWCard,
      WWShowCard,
      ThreeDButton,
      RefreshIcon,
      BaseButton,
      Loader
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

        if ((this.articles.some(x => x.id == articleId))) return null;

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
      }
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
        for (let i = 0; i < Math.min(paginationCount, this.shuffeledArticleKeys.length); i++) {
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
      }
    },
  });
</script>
<style>
.h-80vh{
  height: 80vh
}
</style>