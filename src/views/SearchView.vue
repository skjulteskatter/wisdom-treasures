<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-4 sm:top-20 left-0 z-40 w-full h-0">
        <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50"/>
        <ScrollToTopButton class="fixed top-0 h-max"/>
        <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50"/>
    </div>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center py-4">
        <BackButton/>
        <h1 class="absolute left-0 right-0 text-center text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">{{ $t('search') }}</h1>
    </div>
    <MultiSearch 
        @articles:article-hits="setArticles"
        @audioClips:audioClipHits="setAudioClips"
        @searched-word:searched-word="setSearchedWord"
        @authors:author-hits="setAuthors"
        @themes:theme-hits="setThemes"
        @origins:originHits="setOrigins"
        @search-loading:search-loading="setSearchLoading"
        :search-on-load="true">
    </MultiSearch>

    <ToggleSlideButton :label="'Show audio files'" class="sm:w-1/2 mt-6 mx-10 sm:ml-auto sm:mr-auto" v-model="showAudioClips" @change="resetPagination()" />
    <div class="mx-5 sm:mx-0">
        <div v-if="searchLoading" class="absolute h-full w-full z-40 glass">
            <div class="h-40">
                <Loader :loading="true" class="overflow-hidden"/>
            </div>
        </div>
        <div v-if="searchedWord.length > 0 && themeHits.length > 0" id="ThemeSection" class="mt-4">
            <h1 class="text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">{{ ($t('common.themes')).toUpperCase() }}</h1>
            <div id="ThemeCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                <div v-for="(theme, index) in themeHits" :key="index.toString() + forLoopKey.toString()" class="flex flex-col">
                    <ThemeCard :publication="theme" class="grow" :strech-y="true"/>
                </div>
            </div>
        </div>
        <div v-if="searchedWord.length > 0 && originHits.length > 0" id="OriginSection" class="mt-4">
            <h1 class="text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">{{ $t('common.origin').toUpperCase() }}</h1>
            <div id="OriginCards" class="flex flex-wrap mt-4">
                <div v-for="(origin, index) in originHits" :key="index.toString() + forLoopKey.toString()" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0 mt-4">
                    <Origin :origin="origin"/>
                </div>
            </div>
        </div>
        <div v-show="!showAudioClips" v-if="articleHitsPagination.length > 0" id="WordSection" class="mt-4">
            <h1 class="text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">{{ $t('common.wisdomWords').toUpperCase() }}</h1>
            <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                <div v-for="(article, index) in articleHitsPagination" :key="index.toString() + forLoopKey.toString()" class="flex flex-col">
                    <WWCard :article="article" class="grow" :strech-y="true"/>
                </div>
            </div>
        </div>
        <div v-show="showAudioClips" v-if="audioClipHitsPagination.length > 0" id="WordSection" class="mt-4">
            <h1 class="text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">{{ $t('common.audioClips').toUpperCase() }}</h1>
            <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                <div v-for="(audioClip, index) in audioClipHitsPagination" :key="index.toString() + forLoopKey.toString()" class="flex flex-col">
                    <AudioCard :audio-clip="audioClip" class="grow" :strech-y="true"/>
                </div>
            </div>
        </div>
        <div id="loaderDiv">
            <Loader :loading="loadingMore" class="mt-2"/>
        </div>
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
import { defineComponent } from 'vue';
import BackButton from '@/components/BackButton.vue';
import { useSessionStore } from '@/stores/session';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import WWCard from '@/components/WWCard.vue';
import MultiSearch from '@/components/Search/MultiSearch.vue';
import ThemeCard from '@/components/ThemeCard.vue';
import Loader from '@/components/Loader.vue';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';
import ToggleSlideButton from '@/components/ToggleSlideButton.vue';
import AudioCard from '@/components/AudioCard.vue';
import type { AudioClip } from '@/classes/AudioClip';
import { QuestionMarkCircleIcon } from '@heroicons/vue/outline';
import Origin from '@/components/Origin.vue';
import type { Origin as OriginClass } from '@/classes/Origin';

  export default defineComponent({
    name: "SearchView",
    data() {
        return {
            searchedWord: "" as string,
            store: useSessionStore(),
            articleHits: [] as Article[],
            audioClipHits: [] as AudioClip[],
            authorHits: [] as Contributor[],
            themeHits: [] as Publication[],
            originHits: [] as OriginClass[],
            searchLoading: false as boolean,
            loadingMore: false as boolean,
            articleHitsPagination: [] as Article[],
            audioClipHitsPagination: [] as AudioClip[],
            showAudioClips: false as boolean,
            forLoopKey: 0 as number,
        }
    },
    props: {
    },
    components: {
        BackButton,
        WWCard,
        MultiSearch,
        ThemeCard,
        Loader,
        ScrollToTopButton,
        ToggleSlideButton,
        AudioCard,
        QuestionMarkCircleIcon,
        Origin
    },
    mounted() {
        window.addEventListener('scroll', this.onScroll);
        if (this.homePath !== this.currentPath) this.$router.push({ name: "search" });
    },
    methods: {
        resetPagination(){
            this.setArticles(this.articleHits.concat(this.articleHitsPagination));
            this.setAudioClips(this.audioClipHits.concat(this.audioClipHitsPagination));
        },
        refreshForLoopKey()
        {
            this.forLoopKey = this.forLoopKey > 10 ? 0 : this.forLoopKey + 1;
        },
        setArticles(value : Article[]){
            this.articleHits = value;
            this.articleHitsPagination = [];
            this.fillRandomArticles(20);
            this.refreshForLoopKey();
        },
        setAudioClips(value : AudioClip[]){
            this.audioClipHits = value;
            this.audioClipHitsPagination = [];
            this.fillRandomAudioClips(20);
            this.refreshForLoopKey();
        },
        setThemes(value : Publication[]){
            this.themeHits = value;
            this.refreshForLoopKey();
        },
        setOrigins(value : OriginClass[]){
            console.log(value.length);
            this.originHits = value;
            this.refreshForLoopKey();
        },
        setAuthors(value : Contributor[]){
            this.authorHits = value;
            this.refreshForLoopKey();
        },
        setSearchedWord(value : string){
            this.searchedWord = value;
        },
        setSearchLoading(value : boolean){
            this.searchLoading = value;
        },
        async onScroll(){
            if (!this.showAudioClips && this.articleHits.length <= 0) return;
            if (this.showAudioClips && this.audioClipHits.length <= 0) return;

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
        fillRandomArticles(paginationCount : number){
            let articleHitsMax = this.articleHits.length;
            for (let i = 0; i < Math.min(paginationCount, articleHitsMax); i++) {
                let nextArticle = this.articleHits[0]
                if (nextArticle != undefined){
                    this.articleHitsPagination.push(nextArticle);
                    this.articleHits.splice(0, 1);
                }
            }
        },
        fillRandomAudioClips(paginationCount : number){
            let audioClipHitsMax = this.audioClipHits.length;
            for (let i = 0; i < Math.min(paginationCount, audioClipHitsMax); i++) {
                let nextAudioClip = this.audioClipHits[0]
                if (nextAudioClip != undefined){
                    this.audioClipHitsPagination.push(nextAudioClip);
                    this.audioClipHits.splice(0, 1);
                }
            }
        },
    },
    computed: {
        sessionInitialized(): boolean 
        {
            return this.store.sessionInitialized;
        },
        currentPath(): string {
            return !this.$route.path.endsWith("/") ? this.$route.path : this.$route.path.slice(0, this.$route.path.length - 1);
        },
        homePath(): string {
          let route = (this.$router.getRoutes().find(x => x.name == 'search')?.path || "⛄");
          return !route.endsWith("/") ? route : route.slice(0, route.length - 1);
        },
        numberOfArticleHits(): number {
          return this.articleHits.length + this.articleHitsPagination.length;
        },
        numberOfAudioClipHits(): number {
          return this.audioClipHits.length + this.audioClipHitsPagination.length;
        },
    }
  });
</script>

<style scoped>
.glassDropDown {
	background: (255, 255, 255, 0.1);
	backdrop-filter: blur(3px);
	-webkit-backdrop-filter: blur(3px);
}
.glassDropDown > div {
	background: rgba(255, 255, 255, 0.5);
}
</style>