<template>
  <main>
    <div class="bg-[#3D6E7C] sm:bg-transparent shadow-md sm:shadow-none flex items-center sm:items-start mb-6 sm:mb-0">
      <BackButton/>
      <h1 class="my-6 text-2xl sm:text-3xl font-bold text-white sm:text-inherit tracking-wide">
        Favorites
      </h1>
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