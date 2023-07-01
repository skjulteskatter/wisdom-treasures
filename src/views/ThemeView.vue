<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-4 sm:top-20 left-0 z-40 w-full h-0">
      <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50" />
      <ScrollToTopButton class="fixed top-0 h-max" />
      <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50" />
    </div>

    <MannaButton :manna-article-id-list="Array.from(store.articles.values()).filter(x => x.publicationId == $route.params.themeId).map(x => x.id)"></MannaButton>

    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none pb-5">
      <div class="flex justify-between items-center h-full">
        <div>
          <BackButton />
        </div>
        <div class="flex justify-center">
          <h1 class="my-4 sm:my-6 text-base sm:text-xl self-center font-bold text-white sm:text-inherit tracking-wide">
            {{ publication?.title ?? "" }}
          </h1>
        </div>
        <MiniButton size="large" :three-d="true" @clicked="getAndSetRandomArticle" class="mr-3">
          <template #icon>
            <img src="/img/mannakorn_white.svg" class="md:hidden h-4 w-full">
          </template>
        </MiniButton>
      </div>
      <div>
        <MultiSearch theme="white" :initial-theme-filter="[$route.params.themeId]"
          :return-all-if-no-hits="true"
          :search-on-load="true"
          @articles:article-hits="setSearchArticles" @search-loading:search-loading="setSearchLoading"
          class="mx-5 sm:mx-10 text-white">
        </MultiSearch>
      </div>
    </div>

    <div class="flex mx-auto w-full justify-center">
      <ToggleSlideButton :label="'Show audio files'" class="mx-5 sm:mx-0 py-3 w-full" v-model="showAudioFiles" />
    </div>

    <WWShowCard v-if="randomArticle" :article="randomArticle" class="mx-5 my-5 sm:mx-0" :forThemeView="true" />

    <div>
      <div v-if="searchingLoading" class="absolute h-full w-full z-40 glass">
        <div class="h-40">
          <Loader :loading="true" class="overflow-hidden" />
        </div>
      </div>
      <div v-show="!showAudioFiles" id="WWCards"
        class="px-5 pt-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div v-for="(article, index) in articleHitsPagination" :key="index" class="flex flex-col">
          <WWCard :article="article" class="grow" :strech-y="true" />
        </div>
      </div>
      <div v-show="showAudioFiles" id="WWAudioCards"
        class="px-5 pt-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div v-for="(article, index) in articleHitsPagination" :key="index" class="flex flex-col">
          <WWAudioCard :article="article" class="grow" :strech-y="true" />
        </div>
      </div>
      <div id="loaderDiv">
        <Loader :loading="loadingMoreArticles" class="mt-2" />
      </div>
    </div>

  </main>
</template>

<script lang="ts">
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import WWCard from '@/components/WWCard.vue';
import { useSessionStore } from '@/stores/session';
import router from '@/router';
import { Notification } from '@/classes/notification';
import BackButton from '@/components/BackButton.vue';
import MiniButton from '@/components/MiniButton.vue';
import WWShowCard from '@/components/WWShowCard.vue';
import { mannaHistory } from '@/services/localStorage';
import MultiSearch from '@/components/MultiSearch.vue';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';
import ToggleSlideButton from '@/components/ToggleSlideButton.vue';
import WWAudioCard from '@/components/WWAudioCard.vue';
import Loader from '@/components/Loader.vue';
import MannaButton from '@/components/MannaButton.vue';

export default defineComponent({
  name: "ThemeView",
  data() {
    return {
      store: useSessionStore(),
      articles: [] as Article[], 
      dataFavorites: undefined as string[] | undefined,
      publication: undefined as Publication | undefined,
      randomArticle: null as Article | null,
      showWordOfTheDay: false as boolean,
      searchArticles: [] as Article[],
      showAudioFiles: false as boolean,
      articleHitsPagination: [] as Article[],
      searchingLoading: false as boolean,
      loadingMoreArticles: false as boolean,
      showSearchBar: false as boolean,
    }
  },
  components: {
    WWCard,
    BackButton,
    MiniButton,
    WWShowCard,
    MultiSearch,
    ScrollToTopButton,
    ToggleSlideButton,
    WWAudioCard,
    Loader,
    MannaButton,
  },
  computed: {
    searchOrAllArticles(): Article[] {
      if (this.searchArticles.length > 0) return this.searchArticles;
      console.log("Couldn't find any articles!!");
      return this.articles;
    },
    storeFavorites(): string[] {
      return this.store.favorites;
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
    articleIds(): string[] {
      return this.articles.map(x => x.id);
    },
  },
  watch: {
    sessionInitialized(oldVal, newVal) {
      if (!newVal) return;
      console.log(this.$route.params.themeId.toString());
      this.getAndSetPublication();
      this.assureCorrectSlug();
      this.assureCorrectArticleNumber();
    }
  },
  methods: {
    toggleSearchBar() {
      this.showSearchBar = !this.showSearchBar
    },
    setSearchLoading(value: boolean) {
      this.searchingLoading = value;
    },
    async onScroll() {
      if (this.searchArticles.length <= 0) return;

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
      let articleHitsMax = this.searchArticles.length;
      for (let i = 0; i < Math.min(paginationCount, articleHitsMax); i++) {
        let nextArticle = this.searchArticles[i]
        if (nextArticle != undefined) {
          this.articleHitsPagination.push(nextArticle);
          this.searchArticles.splice(i, 1);
        }
      }
    },
    setSearchArticles(value: Article[]) {
      this.searchArticles = value;
      this.articleHitsPagination = [];
      this.fillRandomArticles(20);
    },
    refreshDataFavorites() {
      this.dataFavorites = [...this.storeFavorites];
    },
    getAndSetPublication() {
      this.publication = this.store.publications.get(this.$route.params.themeId.toString());
    },
    assureCorrectSlug() {
      if (this.publication !== undefined) {
        const fullPath = this.$route.fullPath;
        let urlSlug: string = this.$route.params.themeAutoSlug?.toString() ?? "";
        let newPath: string = "";
        if (urlSlug.length > 0)
          newPath = fullPath.replace(this.$route.params.themeAutoSlug.toString(), this.getFakeSlug(this.publication.title));
        else
          newPath = `${fullPath}${fullPath.endsWith("/") ? "" : "/"}${this.getFakeSlug(this.publication.title)}`;

        this.$router.replace({ path: newPath })
      }
    },
    assureCorrectArticleNumber() {
      if (this.$route.params.wwNumber === undefined) return;
      let articleNumber: number = (+this.$route.params.wwNumber?.toString());

      let articleExist: boolean = false;
      if (!Number.isNaN(articleNumber)) {
        for (const article of this.articles) {
          if (article.number == articleNumber) {
            articleExist = true;
            break;
          }
        }
      }

      if (!articleExist)
        this.articleNotFound(articleNumber);
    },
    getFakeSlug(text: string): string {
      return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
    },
    articleNotFound(num: number): void {
      //Should probably navigate back 🤷‍♂️
      let message = Number.isNaN(num) ? "Couldn't find article" : "Couldn't find article number: " + num.toString();
      this.store.notifications.push(new Notification(message, "error"));
      router.replace({ path: this.$route.fullPath.replace(this.$route.params.wwNumber?.toString() ?? "", "") });
    },
    getAndSetRandomArticle(): void {
      this.randomArticle = this.articles[Math.floor(Math.random() * this.articles.length)] || null;
      mannaHistory.addOrReplace(this.randomArticle.id);
      this.showWordOfTheDay = false;
    },
  },
  mounted() {
    if (this.publication !== undefined) this.articles = Array.from(this.store.articles.values()).filter(x => x.publicationId == this.publication?.id)
    
    if (this.sessionInitialized) {
      this.getAndSetPublication();
      this.assureCorrectSlug();
      this.assureCorrectArticleNumber();
    }

    window.addEventListener('scroll', this.onScroll);
  }
});
</script>
