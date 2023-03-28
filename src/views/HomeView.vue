<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
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
    <div id="wordOfTheDayCotainer" class="mt-20 mb-20 grid sm:grid-cols-3 grid-cols-1 sm:gap-2">
      <WWShowCard v-if="randomArticle" :article="randomArticle" class="col-span-2" :customTitle="showWordOfTheDay ? 'Word of the day' : ''"/>
      <ThreeDButton size="large" :three-d="true" @clicked="getAndSetRandomArticle" class="mt-2 sm:mt-0 mx-2 sm:mx-0">
        <p class="text-xl">Generate new word</p>
        <template #icon>
          <RefreshIcon class="w-8"/>
        </template>
      </ThreeDButton>
    </div>
    <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(article, index) in articles" :key="index" class="flex flex-col">
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
      RefreshIcon
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