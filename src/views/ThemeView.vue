<template>
  <main>
    <div>
    <div id="scrollToTopButtonDiv" class="flex fixed top-4 sm:top-20 left-0 z-40 w-full h-0">
      <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50" />
      <ScrollToTopButton class="fixed top-0 h-max" />
      <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50" />
    </div>

    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center justify-between py-4 pr-4">
      <BackButton />
      <h1 class="text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">
        {{ publication?.title ?? "" }}
      </h1>
      <MannaButton :manna-article-id-list="Array.from(store.articles.values()).filter(x => x.publicationId == $route.params.themeId).map(x => x.id)"></MannaButton>
    </div>
    <MultiSearch :initial-theme-filter="[$route.params.themeId]"
      :return-all-if-no-hits="true"
      :search-on-load="true"
      @audioClips:audioClipHits="setSearchAudioClips"
      @articles:article-hits="setSearchArticles" 
      @search-loading:search-loading="setSearchLoading"
      class="mx-5 sm:mx-10 text-white">
    </MultiSearch>

    <ToggleSlideButton :label="'Show audio files'" class="sm:w-1/2 mt-6 mx-10 sm:ml-auto sm:mr-auto" v-model="showAudioClips" @change="resetPagination()"/>

    <WWShowCard v-if="randomArticle" :article="randomArticle" class="mx-5 my-5 sm:mx-0" :forThemeView="true" />

    <div>
      <div v-if="searchingLoading" class="absolute h-full w-full z-40 glass">
        <div class="h-40">
          <Loader :loading="true" class="overflow-hidden" />
        </div>
      </div>
      <div v-show="!showAudioClips" id="WWCards"
        class="px-5 pt-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div v-for="(article, index) in articleHitsPagination" :key="index + forLoopKey.toString()" class="flex flex-col">
          <WWCard :article="article" class="grow" :strech-y="true" />
        </div>
      </div>
      <div v-show="showAudioClips" id="AudioCards"
        class="px-5 pt-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div v-for="(audioClip, index) in audioClipHitsPagination" :key="index + forLoopKey.toString()" class="flex flex-col">
          <AudioCard :audio-clip="audioClip" class="grow" :strech-y="true" />
        </div>
      </div>
      <div id="loaderDiv">
        <Loader :loading="loadingMore" class="mt-2" />
      </div>
    </div>
    <WWCard id="placeHolderWWforlinkedwords" v-if="linkedArticle !== null" :article="linkedArticle" class="hidden"/>
  </div>

  
  <div v-if="sessionInitialized && ((showAudioClips && numberOfAudioClipHits <= 0) || (!showAudioClips && numberOfArticleHits <= 0))" class="grow flex flex-col mt-6">
      <div class="grow" />
      <QuestionMarkCircleIcon class="w-20 grayscale opacity-80 place-self-center" />
      <div class="place-self-center">{{ $t('no-results-found.in-search') }}</div>
      <div class="grow" />
    </div>

  </main>
</template>

<script lang="ts">
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import WWCard from '@/components/WWCard.vue';
import { useSessionStore } from '@/stores/session';
import router from '@/router';
import { InlineNotification } from '@/classes/notification';
import BackButton from '@/components/BackButton.vue';
import WWShowCard from '@/components/WWShowCard.vue';
import MultiSearch from '@/components/Search/MultiSearch.vue';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';
import ToggleSlideButton from '@/components/ToggleSlideButton.vue';
import AudioCard from '@/components/AudioCard.vue';
import Loader from '@/components/Loader.vue';
import MannaButton from '@/components/MannaButton.vue';
import type { AudioClip } from '@/classes/AudioClip';
import { log } from '@/services/env';
import { QuestionMarkCircleIcon } from '@heroicons/vue/outline';

export default defineComponent({
  name: "ThemeView",
  data() {
    return {
      store: useSessionStore(),
      articles: [] as Article[], 
      audioClips: [] as AudioClip[], 
      dataFavorites: undefined as string[] | undefined,
      publication: undefined as Publication | undefined,
      randomArticle: null as Article | null,
      showWordOfTheDay: false as boolean,
      searchArticles: [] as Article[],
      searchAudioClips: [] as AudioClip[],
      showAudioClips: false as boolean,
      articleHitsPagination: [] as Article[],
      audioClipHitsPagination: [] as AudioClip[],
      searchingLoading: false as boolean,
      loadingMore: false as boolean,
      showSearchBar: false as boolean,
      forLoopKey: 0 as number
    }
  },
  components: {
    WWCard,
    BackButton,
    WWShowCard,
    MultiSearch,
    ScrollToTopButton,
    ToggleSlideButton,
    AudioCard,
    Loader,
    MannaButton,
    QuestionMarkCircleIcon
  },
  computed: {
    linkedArticle(): null | Article {

      if (this.homePath === this.currentPath) return null;
      const articleNumber = this.currentPathNumber ?? Number.NaN;
      const articleId = this.store.articleNumberLookup.get(articleNumber);
      if (articleId === undefined) {
        return null;
      }

      if (this.articleHitsPagination.some(x => x.number == articleNumber))
      {
        return null;
      }

      const article = this.store.articles.get(articleId || "");

      if (article === undefined) {
        return null;
      }

      return article;
    },
    searchOrAllArticles(): Article[] {
      if (this.searchArticles.length > 0) return this.searchArticles;
      log && console.log("Couldn't find any articles!");
      return this.articles;
    },
    searchOrAllAudioClips(): AudioClip[] {
      if (this.searchAudioClips.length > 0) return this.searchAudioClips;
      log && console.log("Couldn't find any audioClips!");
      return this.audioClips;
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
    articlesInitialized(): boolean {
      return this.store.articlesInitialized;
    },
    articleIds(): string[] {
      return this.articles.map(x => x.id);
    },
    audioClipIds(): string[] {
      return this.audioClips.map(x => x.id);
    },
    numberOfArticleHits(): number {
      return this.searchArticles.length + this.articleHitsPagination.length;
    },
    numberOfAudioClipHits(): number {
      return this.searchAudioClips.length + this.audioClipHitsPagination.length;
    },
  },
  watch: {
    sessionInitialized(oldVal, newVal) {
      if (!newVal) return;
      log && console.log(this.$route.params.themeId.toString());
      this.getAndSetPublication();
      this.assureCorrectSlug();
    },
    articlesInitialized(oldVal, newVal) {
      if (!newVal) return;
      this.assureCorrectArticleNumber();
    },
    currentPath() {
      this.assureCorrectSlug();
      this.assureCorrectArticleNumber();
    }
  },
  methods: {
    refreshForLoopKey()
    {
      this.forLoopKey = this.forLoopKey > 10 ? 0 : this.forLoopKey + 1;
    },
    resetPagination(){
      this.setSearchArticles(this.searchArticles.concat(this.articleHitsPagination));
      this.setSearchAudioClips(this.searchAudioClips.concat(this.audioClipHitsPagination));
    },
    toggleSearchBar() {
      this.showSearchBar = !this.showSearchBar
    },
    setSearchLoading(value: boolean) {
      this.searchingLoading = value;
      this.refreshForLoopKey();
    },
    async onScroll() {
      if (this.showAudioClips == false && this.searchArticles.length <= 0) return;
      if (this.showAudioClips && this.searchAudioClips.length <= 0) return;

      let bottom = window.innerHeight + window.pageYOffset == document.body.scrollHeight;
      if (!bottom) return;
      this.loadingMore = true;
      setTimeout(() => {
        if (this.showAudioClips)
            this.fillRandomAudioClips(20);
        else
            this.fillRandomArticles(20);
      }, 1);
      setTimeout(() => {
        this.loadingMore = false;
      }, 200);
    },
    fillRandomArticles(paginationCount: number) {
      let articleHitsMax = this.searchArticles.length;
      for (let i = 0; i < Math.min(paginationCount, articleHitsMax); i++) {
        let nextArticle = this.searchArticles[0]
        if (nextArticle != undefined) {
          this.articleHitsPagination.push(nextArticle);
          this.searchArticles.splice(0, 1);
        }
      }
    },
    fillRandomAudioClips(paginationCount: number) {
      let audioClipHitsMax = this.searchAudioClips.length;
      for (let i = 0; i < Math.min(paginationCount, audioClipHitsMax); i++) {
        let nextAudioClip = this.searchAudioClips[0]
        if (nextAudioClip != undefined) {
          this.audioClipHitsPagination.push(nextAudioClip);
          this.searchAudioClips.splice(0, 1);
        }
      }
    },
    setSearchArticles(value: Article[]) {
      this.searchArticles = value;
      this.articleHitsPagination = [];
      this.fillRandomArticles(20);
      this.refreshForLoopKey();
    },
    setSearchAudioClips(value: AudioClip[]) {
      this.searchAudioClips = value;
      this.audioClipHitsPagination = [];
      this.fillRandomAudioClips(20);
      this.refreshForLoopKey();
    },
    refreshDataFavorites() {
      this.dataFavorites = [...this.storeFavorites];
    },
    getAndSetPublication() {
      this.publication = this.store.publications.get(this.$route.params.themeId.toString());
    },
    assureCorrectSlug() {
      const fullPath = this.$route.fullPath;
      if (this.publication === undefined || !fullPath.includes(this.publication.id)) return;
      
      let urlSlug: string = this.$route.params.autoSlug?.toString() ?? "";
      let newPath: string = "";
      if (urlSlug.length > 0)
        newPath = fullPath.replace(this.$route.params.autoSlug.toString(), this.getFakeSlug(this.publication.title));
      else
        newPath = `${fullPath}${fullPath.endsWith("/") ? "" : "/"}${this.getFakeSlug(this.publication.title)}`;

      this.$router.replace({ path: newPath })
    },
    assureCorrectArticleNumber() {
      this.setArticles();
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
      this.store.notifications.push(new InlineNotification(message, "error"));
      router.replace({ path: this.$route.fullPath.replace(this.$route.params.wwNumber?.toString() ?? "", "") });
    },
    setArticles(): void {
      if (this.articles.length <= 0){
        this.articles = Array.from(this.store.articles.values()).filter(x => x.publicationId == this.publication?.id);
      }
    }
  },
  mounted() {
    if (this.publication !== undefined) this.articles = Array.from(this.store.articles.values()).filter(x => x.publicationId == this.publication?.id)
    
    if (this.sessionInitialized) {
      this.getAndSetPublication();
      this.assureCorrectSlug();
    }

    if (this.articlesInitialized) {
      this.assureCorrectArticleNumber();
    }

    this.store.publicationIdSearchFilter = [];

    window.addEventListener('scroll', this.onScroll);
  }
});
</script>
