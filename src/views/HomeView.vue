<template>
  <main>
    <div class="flex items-center shadow-md sm:shadow-none z-50 max-h-16 sm:h-auto w-full bg-(--wt-c-black-soft) fixed top-0 left-0 sm:static px-8">
      <h1 class="text-xl my-6 sm:text-3xl font-bold">
        <span v-if="currentUser" class="font-bold">
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
    <div id="wordOfTheDayCotainer" class="flex flex-col justify-between mt-20 sm:mb-20 sm:grid sm:grid-cols-3 grid-cols-1 sm:gap-2">

        <!-- <div class="sm:hidden absolute bottom-20 -left-20 flex -rotate-90">
          <BaseButton theme="menuButton" @click="navigate('history')">History</BaseButton>
          <BaseButton theme="menuButton" @click="e => navigate('favorites', e)">Favorites</BaseButton>
          <BaseButton theme="menuButton" @click="e => navigate('dashboard', e)">Daily word</BaseButton>
        </div> -->

        <WWShowCard v-if="randomArticle" :article="randomArticle" class="hidden sm:block col-span-2" :customTitle="showWordOfTheDay ? 'Word of the day' : ''"/>
        <WWShowCard v-if="randomArticle" :article="randomArticle" class="sm:hidden col-span-2 w-80 " :customTitle="showWordOfTheDay ? ' ' : ' ' "/>
        
      <ThreeDButton size="large" :three-d="true" @clicked="getAndSetRandomArticle" class="self-end w-full mt-2 flex-shrink-0 sm:mt-0 sm:mx-0 sm:h-full">
        <p class="text-xl">Generate new word</p>
        <template #icon>
          <RefreshIcon class="w-8"/>
        </template>
      </ThreeDButton>
    </div>
    <div id="WWCards" class="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(article, index) in articles.slice(0,100)" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true"/>
      </div>
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

  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        publications : [] as Publication[],
        currentUser : null as User | null,
        store: useSessionStore(),
        randomArticle : null as Article | null,
        showWordOfTheDay : false as boolean,
      }
    },
    components: {
      WWCard,
      WWShowCard,
      ThreeDButton,
      RefreshIcon,
      BaseButton
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
    },
    methods:{
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