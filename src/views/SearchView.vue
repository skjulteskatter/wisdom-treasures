<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-4 sm:top-20 left-0 z-40 w-full h-0">
        <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50"/>
        <ScrollToTopButton class="fixed top-0 h-max"/>
        <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50"/>
    </div>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center justify-between py-4 sm:py-6">
        <BackButton/>
        <h1 class="text-base sm:text-xl  font-bold text-white sm:text-inherit tracking-wide">Search</h1>
        <BackButton class="opacity-0" disabled/>
    </div>
    <MultiSearch 
        @articles:article-hits="setArticles" 
        :initial-search-word="searchedWordInput" 
        @searched-word:searched-word="setSearchedWord"
        @authors:author-hits="setAuthors"
        @themes:theme-hits="setThemes"
        @search-loading:search-loading="setSearchLoading"
        :inSearchView="true">
    </MultiSearch>

    <ToggleSlideButton :label="'Show audio files'" class="mt-4 mx-5 sm:mx-0" v-model="showAudioFiles" />
    
    <div class="mx-5 sm:mx-0">
        <div v-if="searchLoading" class="absolute h-full w-full z-40 glass">
            <div class="h-40">
                <Loader :loading="true" class="overflow-hidden"/>
            </div>
        </div>
        <div v-if="searchedWord.length > 0 && themeHits.length > 0" id="ThemeSection" class="mt-4">
            <h1 class="text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">Themes</h1>
            <div id="ThemeCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                <div v-for="(theme, index) in themeHits" :key="index" class="flex flex-col">
                    <ThemeCard :publication="theme" class="grow" :strech-y="true"/>
                </div>
            </div>
        </div>
        <div v-show="!showAudioFiles" v-if="articleHitsPagination.length > 0" id="WordSection" class="mt-4">
            <h1 class="text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">Words</h1>
            <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                <div v-for="(article, index) in articleHitsPagination" :key="index" class="flex flex-col">
                    <WWCard :article="article" class="grow" :strech-y="true"/>
                </div>
            </div>
        </div>
        <div v-show="showAudioFiles" v-if="articleHitsPagination.length > 0" id="WordSection" class="mt-4">
            <h1 class="text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">Words</h1>
            <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                <div v-for="(article, index) in articleHitsPagination" :key="index" class="flex flex-col">
                    <WWAudioCard :article="article" class="grow" :strech-y="true"/>
                </div>
            </div>
        </div>
        <div id="loaderDiv">
            <Loader :loading="loadingMoreArticles" class="mt-2"/>
        </div>
    </div>
    
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BackButton from '@/components/BackButton.vue';
import { useSessionStore } from '@/stores/session';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import WWCard from '@/components/WWCard.vue';
import MultiSearch from '@/components/MultiSearch.vue';
import ThemeCard from '@/components/ThemeCard.vue';
import Loader from '@/components/Loader.vue';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';
import ToggleSlideButton from '@/components/ToggleSlideButton.vue';
import WWAudioCard from '@/components/WWAudioCard.vue';

  export default defineComponent({
    name: "SearchView",
    data() {
        return {
            searchedWordInput: "" as string,
            searchedWord: "" as string,
            store: useSessionStore(),
            articleHits: [] as Article[],
            authorHits: [] as Contributor[],
            themeHits: [] as Publication[],
            searchLoading: false as boolean,
            loadingMoreArticles: false as boolean,
            articleHitsPagination: [] as Article[],
            showAudioFiles: false as boolean,
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
    WWAudioCard,
},
    computed: {
        searchWordBridge(){
            return this.store.searchWordBridge;
        },
    },
    watch : {
        searchWordBridge(newValue: string){
            if (newValue.length > 0){
                this.searchedWordInput = newValue;
                this.store.searchWordBridge = "";
            }
        },
    },
    mounted() {
        this.searchedWordInput = this.searchWordBridge;
        if (this.searchedWordInput.length > 0){
            this.searchedWordInput = this.store.searchWordBridge;
            this.store.searchWordBridge = "";
        }

        window.addEventListener('scroll', this.onScroll);
    },
    methods: {
        setArticles(value : Article[]){
            this.articleHits = value;
            this.articleHitsPagination = [];
            this.fillRandomArticles(20);
        },
        setThemes(value : Publication[]){
            this.themeHits = value;
        },
        setAuthors(value : Contributor[]){
            this.authorHits = value;
        },
        setSearchedWord(value : string){
            this.searchedWord = value;
        },
        setSearchLoading(value : boolean){
            this.searchLoading = value;
        },
        async onScroll(){
            if (this.articleHits.length <= 0) return;

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
            let articleHitsMax = this.articleHits.length;
          for (let i = 0; i < Math.min(paginationCount, articleHitsMax); i++) {
            let nextArticle = this.articleHits[i]
            if (nextArticle != undefined){
              this.articleHitsPagination.push(nextArticle);
              this.articleHits.splice(i, 1);
            }
          }
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