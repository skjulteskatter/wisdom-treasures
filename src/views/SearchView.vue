<template>
  <main class="mt-4">
    <BackButton/>
    <BaseCard class="mt-4">
        <template #header> 
            <div class="font-sans">
                <div v-if="searchedWord" class="font-bold">
                    Showing {{numberOfResults}} Results for "{{searchedWord}}"
                </div>
                <div v-else class="font-bold">
                    Search
                </div>
            </div>
        </template>
            <BaseInput v-model="searchWord" style-type="search" size="lg" @search-action="search($event)"/>
        <template>
            
        </template>
    </BaseCard>
    <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
      <div v-for="(article, index) in hits" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true"/>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseCard from '@/components/BaseCard.vue';
import BaseInput from '@/components/BaseInput.vue';
import BackButton from '@/components/BackButton.vue';
import { useSessionStore } from '@/stores/session';
import type { Article } from 'hiddentreasures-js';
import WWCard from '@/components/WWCard.vue';

  export default defineComponent({
    name: "SearchView",
    data() {
        return {
            searchWord: "" as string,
            searchedWord: "" as string,
            store: useSessionStore(),
            hits: [] as Article[],
        }
    },
    props: {
    },
    components: {
        BaseCard,
        BaseInput,
        BackButton,
        WWCard,
    },
    computed: {
        searchWordBridge(){
            return this.store.searchWordBridge;
        },
        allArticles() : Article[] {
            return Array.from(this.store.articles.values());
        },
        numberOfResults() : number {
            return this.hits.length;
        }
    },
    watch : {
        searchWordBridge(newValue: string){
            if (newValue.length > 0){
                this.search(newValue);
                this.store.searchWordBridge = "";
            }
        },
    },
    mounted() {
        this.searchedWord = this.searchWordBridge;
        if (this.searchedWord.length > 0){
            this.store.searchWordBridge = "";
            this.search(this.searchedWord);
        }

    },
    methods: {
        async search(searchWord: string) {
            this.searchedWord = searchWord;
            
            this.hits = this.allArticles.filter(x => x.content?.content.includes(searchWord));
        },
    }
  });
</script>

<style>
</style>