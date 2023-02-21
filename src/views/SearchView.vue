<template>
  <main class="mt-4">
    <BackButton/>
    <MultiSearch 
        @articles:article-hits="setArticles" 
        :initial-search-word="searchedWordInput" 
        @searched-word:searched-word="setSearchedWord"
        @authors:author-hits="setAuthors"
        @themes:theme-hits="setThemes"
        @search-loading:search-loading="setSearchLoading">
    </MultiSearch>
    
    <div class="" >
        <div :class="{ 'glass' : searchLoading}" class="absolute h-full w-full z-40">
            <div class="h-40">
                <Loader :loading="searchLoading" class="overflow-hidden"/>
            </div>
        </div>
        <div v-if="searchedWord.length > 0 && themeHits.length > 0" id="ThemeSection" class="mt-4">
            <h1 class="text-2xl font-bold">Themes</h1>
            <div id="ThemeCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                <div v-for="(theme, index) in themeHits" :key="index" class="flex flex-col">
                    <ThemeCard :publication="theme" class="grow" :strech-y="true"/>
                </div>
            </div>
        </div>
        <div v-if="articleHits.length > 0" id="WordSection" class="mt-4">
            <h1 class="text-2xl font-bold">Words</h1>
            <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                <div v-for="(article, index) in articleHits" :key="index" class="flex flex-col">
                    <WWCard :article="article" class="grow" :strech-y="true"/>
                </div>
            </div>
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
        }
    },
    props: {
    },
    components: {
    BackButton,
    WWCard,
    MultiSearch,
    ThemeCard,
    Loader
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
    },
    methods: {
        setArticles(value : Article[]){
            this.articleHits = value;
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
        }
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