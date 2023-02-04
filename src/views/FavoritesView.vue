<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      Favorites
    </h1>
    <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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

  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        publications : [] as Publication[],
        store: useSessionStore(),
        dataFavorites : undefined as string[] | undefined,
      }
    },
    components: {
      WWCard
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
      }
    },
    methods: {
      refreshDataFavorites(){
        this.dataFavorites = [...this.storeFavorites];
      }
    }
  });
</script>