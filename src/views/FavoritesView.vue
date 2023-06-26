<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-20 left-0 z-40 w-full h-0">
        <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50"/>
        <ScrollToTopButton class="fixed top-0 h-max"/>
        <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50"/>
    </div>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center justify-between sm:items-start py-4 mb-5 sm:mb-0">
      <BackButton/>
      <h1 class="self-center text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">
        {{$t('common.favorites')}}
      </h1>
      <BackButton class="opacity-0"/>
    </div>
    <div id="WWCards" class="px-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(article, index) in favoriteArticles" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true" @close-modal="refreshDataFavorites" @click="refreshDataFavorites"/>
      </div>
    </div>
  </main> 
</template>

<script lang="ts">
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import WWCard from '@/components/WWCard.vue';
import { useSessionStore } from '@/stores/session';
import BackButton from '@/components/BackButton.vue';

  export default defineComponent({
    name: "FavoriteView",
    data() {
      return {
        publications : [] as Publication[],
        store: useSessionStore(),
        dataFavorites : undefined as string[] | undefined,
      }
    },
    components: {
      WWCard,
      BackButton,
    },
    computed: {
      storeFavorites() : string[]{
        return this.store.favorites;
      },
      favorites() : string[]{
        return this.dataFavorites === undefined ? this.storeFavorites : this.dataFavorites;
      },
      favoriteArticles() : Article[] {
        const favoriteArticles = [];
        for (const favorite of this.favorites) {
          const article = this.store.articles.get(favorite);
          if (article === null || article === undefined) continue;
          favoriteArticles.push(article);
        }
        return favoriteArticles;
      },
    },
    methods: {
      refreshDataFavorites(){
        this.dataFavorites = [...this.storeFavorites];
      }
    }
  });
</script>