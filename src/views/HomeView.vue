<template>
  <main>
    <div class="lg:w-full justify-center mx-auto">
      <div
        class="flex py-10 bg-[color:var(--wt-c-white-soft)] sm:bg-transparent items-center shadow-md sm:shadow-none z-40 max-h-10 sm:h-auto w-full top-0 left-0 sm:static px-6 sm:px-0 ">
        <h1 class="text-base font-bold text-[color:var(--wt-color-text-grey)] opacity-80">
          <span v-if="currentUser" class="sm:font-bold text-lg tracking-075">
            {{ $t('common.welcome') }},

            <span class="animated-gradient font-bold cursor-pointer" @click="$router.push({ name: 'profile' })">
              {{ currentUser.displayName }}
            </span>
          </span>
          <span v-else class="sm:font-bold text-lg tracking-075">
            {{ $t('home.welcometo') }}
            <span class="animated-gradient font-bold">
              WisdomTreasures
            </span>
          </span>
        </h1>
      </div>

      <div id="wordOfTheDayCotainer"
        class="flex flex-col justify-between mt-8 sm:mt-0 mb-0 md:mb-5 px-4 sm:px-0 pb-8 sm:pb-5">

        <div class="flex sm:flex-row-reverse">

          <div
            class="flex flex-col sm:w-1/6 justify-between py-16 sm:py-0 -ml-4 sm:ml-6 sm:pl-6 sm:my-10 sm:border-l-2 sm:border-[#dcdcdc]">
            <div class="flex flex-col items-center sm:items-start">
              <div class="w-max -rotate-90 sm:rotate-0 cursor-pointer" @click="changeDisplayWOTD()">
                <span
                  class="text-base sm:text-lg font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80"
                  :class="{ 'highlighted': displayWordOfTheDay }">{{ $t('common.dailyword') }}</span>
                <div v-if="displayWordOfTheDay"
                  class="border-b-2 border-[color:var(--wt-color-secondary-light)] w-full h-1/5"></div>
              </div>
            </div>
            <div class="flex flex-col items-center sm:items-start">
              <div class="w-max -rotate-90 sm:rotate-0 cursor-pointer" @click="changeDisplayFavorites()">
                <span
                  class="text-base sm:text-lg font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80"
                  :class="{ 'highlighted': displayFavorites }">{{ $t('common.favorites') }}</span>
                <div v-if="displayFavorites"
                  class="border-b-2 border-[color:var(--wt-color-secondary-light)] w-full h-1/5"></div>
              </div>
            </div>
            <div class="flex flex-col items-center sm:items-start">
              <div class="w-max -rotate-90 sm:rotate-0 cursor-pointer" @click="changeDisplayHistory()">
                <span
                  class="text-base sm:text-lg font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80"
                  :class="{ 'highlighted': displayHistory }">{{ $t('common.history') }}</span>
                <div v-if="displayHistory" class="border-b-2 border-[color:var(--wt-color-secondary-light)] w-full h-1/5">
                </div>
              </div>
            </div>
          </div>


          <WWShowCard v-if="wordOfTheDay && displayWordOfTheDay" :article="wordOfTheDay" class="w-11/12 sm:w-full"
            :WWCardHomeView="true" />

          <!-- DIV for favourites -->
          <div v-if="displayFavorites" id="WWCards"
            class="w-11/12 sm:w-full h-custom fav-his grid grid-cols-1 gap-2 justify-between overflow-y-auto rounded-lg relative">
            <div class="grid grid-cols-1 gap-2 justify-between overflow-y-auto rounded-lg">
              <div v-if="favoriteArticles.length > 0">
                <div v-for="(article, index) in favoriteArticles" :key="index" class="flex flex-col">
                  <WWCard :article="article" @close-modal="refreshDataFavorites" @click="refreshDataFavorites"
                    class="mb-2" />
                </div>
              </div>
              <div v-else class="h-full grid place-content-center bg-white/50">{{ $t('common.noFavories') }}
              </div>
            </div>

            <div id="shadowDiv" class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F1F1F1] to-transparent">
            </div>
          </div>

          <!-- DIV for History -->
          <div v-if="displayHistory" id="WWCards"
          class="w-11/12 sm:w-full h-custom fav-his grid grid-cols-1 gap-2 justify-between overflow-y-auto rounded-lg relative custom-scrollbar">
            <div class="grid grid-cols-1 gap-2 justify-between overflow-y-auto rounded-lg">
              <div v-if="historyArticles.length > 0">
                <div v-for="(article, index) in historyArticles" :key="index" class="flex flex-col">
                  <WWCard :article="article" @close-modal="refreshDataFavorites" @click="refreshDataFavorites"
                    class="mb-2" />
                </div>
              </div>
              <div v-else class="h-full grid place-content-center bg-white/50">{{ $t('common.noHistory') }}</div>
            </div>

            
            <div id="shadowDiv" class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F1F1F1] to-transparent">
            </div>
          </div>

        </div>
        <div id="bgDiv" class="sm:hidden bg-[#F1F1F1] w-full h-3/4 absolute bottom-0 left-0 -z-50 rounded-t-4xl"></div>
      </div>


      <div class="ml-5 sm:ml-0 justify-center">
        <h1 class="text-base font-bold tracking-075 my-5 sm:mt-0 text-[color:var(--wt-color-text-grey)] opacity-80">
          {{ $t('common.origin').toUpperCase() }}</h1>
        <div class=" rounded-lg shadow-md bg-white/80 my-5">
          <OriginsSwiper class="z-0  px-5" />
        </div>
      </div>

      <div class="mx-5 sm:mx-0 mb-5 ">
        <h1 class="text-base font-bold my-5 sm:mt-0 tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">{{
          $t('common.wisdomManna').toUpperCase() }}</h1>
        <div class="md:w-1/2 mx-auto justify-center">
          <ThreeDButton size="large" :three-d="true" @clicked="getAndSetRandomArticle" class="self-end flex-shrink-0">
            <p class="text-base font-bold tracking-wide px-5">{{ $t('home.getWisdomManna') }}</p>
          </ThreeDButton>
        </div>
        <WWShowCard v-if="randomArticle" :article="randomArticle" class="w-full mt-5" :WWCardHomeView="false" />
        <div v-if="!randomArticle"
          class="w-full h-56 mt-5 flex items-center justify-center rounded-lg shadow-md bg-white/80 text-center">
          <p class="text-[color:var(--wt-color-text-grey)] opacity-80 w-3/5">{{ $t('home.clickSeeWisdomManna') }}</p>
        </div>
        <WWCard id="placeHolderWWforlinkedwords" v-if="linkedArticle !== null" :article="linkedArticle" class="show" />
      </div>
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
import { InlineNotification } from '@/classes/notification';
import router from '@/router';
import WWShowCard from '@/components/WWShowCard.vue';
import ThreeDButton from '@/components/ThreeDButton.vue';
import OriginsSwiper from '@/components/OriginsSwiper.vue';
import { mannaHistory, history } from '@/services/localStorage';



export default defineComponent({
  name: "HomeView",
  data() {
    return {
      publications: [] as Publication[],
      currentUser: null as User | null,
      store: useSessionStore(),
      randomArticle: null as Article | null,
      wordOfTheDay: null as Article | null,
      showWordOfTheDay: false as boolean,
      randomArticleList: [] as Article[],
      shuffeledArticleKeys: [] as string[],
      loadingMoreArticles: false as boolean,
      dataFavorites: undefined as string[] | undefined,
      displayFavorites: false as boolean,
      displayWordOfTheDay: true as boolean,
      displayHistory: false as boolean
    }
  },
  components: {
    WWCard,
    WWShowCard,
    ThreeDButton,
    OriginsSwiper,
  },
  computed: {
    historyArticles(): Article[] {
      let historyArticlesIds: string[] = [];
      for (let [key, value] of history.getAll()) {
        historyArticlesIds.push(key);
      }
      for (let [key, value] of mannaHistory.getAll()) {
        historyArticlesIds.push(key);
      }
      return this.articles.filter(x => historyArticlesIds.includes(x.id));
    },
    articles(): Article[] {
      const articles = Array.from(this.store.articles.values());
      return articles;
    },
    linkedArticle(): null | Article {

      if (this.homePath === this.currentPath) return null;
      const articleId = this.store.articleNumberLookup.get(this.currentPathNumber ?? -1);
      if (articleId === undefined) {
        this.articleNotFound(this.currentPathNumber ?? -1);
        return null;
      }

      const article = this.store.articles.get(articleId || "");
      if (article === undefined) {
        this.articleNotFound(this.currentPathNumber ?? -1);
        return null;
      }

      return article;
    },
    currentPath(): string {
      return !this.$route.path.endsWith("/") ? this.$route.path : this.$route.path.slice(0, this.$route.path.length - 1);
    },
    homePath(): string {
      let route = (router.getRoutes().find(x => x.name == 'dashboard')?.path || "⛄");
      return !route.endsWith("/") ? route : route.slice(0, route.length - 1);
    },
    currentPathNumber(): number | null {
      let match = (this.currentPath.match(/[0-9]+$/) ?? [null])[0];
      if (match == null) return null;
      return parseInt(match);
    },
    sessionInitialized(): boolean {
      return this.store.sessionInitialized;
    },
    storeFavorites(): string[] {
      return this.store.favorites;
    },
    favorites(): string[] {
      return this.dataFavorites ?? this.storeFavorites;
    },
    favoriteArticles(): Article[] {
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
    sessionInitialized(initialized) {
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

    Notification.requestPermission();
  },
  methods: {
    async onScroll() {
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
    fillRandomArticles(paginationCount: number) {
      let shuffeledArticleKeysMax = this.shuffeledArticleKeys.length;
      for (let i = 0; i < Math.min(paginationCount, shuffeledArticleKeysMax); i++) {
        let randomIndex = Math.floor(Math.random() * this.shuffeledArticleKeys.length);
        let randomArticle = (this.store.articles.get(this.shuffeledArticleKeys[randomIndex]))
        if (randomArticle != undefined) {
          this.randomArticleList.push(randomArticle);
          this.shuffeledArticleKeys.splice(randomIndex, 1);
        }
      }
    },
    navigate(name: string, e?: Event) {

      if (name === "register") {
        //Just to mmake sure the login forms appears as 'register' and not as 'login'
        this.store.loginFormBridge = "register";
        name = "login";
      }
      router.push({ name: name });
    },
    articleNotFound(num: number): void {
      //Should probably navigate back 🤷‍♂️
      this.store.notifications.push(new InlineNotification(this.$t('home.couldNotFindArticleNumber') + num.toString(), "error"));
      router.push({ name: "dashboard" });
    },
    checkArticleNumberPath() {
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
      this.randomArticle = this.articles[Math.floor(Math.random() * this.articles.length)] || null;
      mannaHistory.addOrReplace(this.randomArticle.id);
      this.showWordOfTheDay = false;
    },
    getAndSetWordOfTheDayArticle(): void {
      let date: Date = new Date();
      let dateNumber: number = +`${date.getDay()}${date.getMonth()}${date.getFullYear()}999`;
      let randomNumber: number = this.mulberry32(dateNumber);
      let adjustedRandomNumber = Math.round(randomNumber * (this.articles.length - 1));
      if (adjustedRandomNumber < 0 || (adjustedRandomNumber > this.articles.length - 1)) adjustedRandomNumber = 0;
      this.wordOfTheDay = this.articles[adjustedRandomNumber] || null;
      this.showWordOfTheDay = true;
    },
    mulberry32(a: number): number {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    },
    refreshDataFavorites() {
      this.dataFavorites = [...this.storeFavorites];
    },
    changeDisplayFavorites() {
      this.displayFavorites = true
      this.displayWordOfTheDay = false
      this.displayHistory = false
    },
    changeDisplayHistory() {
      this.displayFavorites = false
      this.displayWordOfTheDay = false
      this.displayHistory = true
    },
    changeDisplayWOTD() {
      this.displayFavorites = false
      this.displayWordOfTheDay = true
      this.displayHistory = false
    }
  },
});
</script>
<style scoped>

.tracking-075 {
  letter-spacing: 0.075em
}

.rounded-t-4xl {
  border-top-left-radius: 2.5rem;
  /* 40px */
  border-top-right-radius: 2.5rem;
  /* 40px */
}

.h-custom {
  height: max(28rem, 64vh)
}

.highlighted {
  font-size: 1.15rem;
  color: var(--wt-color-primary);
  opacity: 0.9;
  scale: 1.3;
}

@media(min-width:640px) {
  .h-custom {
    height: auto;
  }

  .h-custom.fav-his {
    height: 18rem
  }
}</style>
