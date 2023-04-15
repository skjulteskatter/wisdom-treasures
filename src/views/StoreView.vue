<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      Store
    </h1>
    <p>Buy just for one month, or a whole year!</p>
    <div id="Cards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
      <StoreCard class="bg-primary text-white/80" @click="() => { /**Redirect to Stripe or something */ }">
        <template #header>
          <div class="w-full flex justify-center">
            <div>Buy wisdom treasures for one month!</div>
          </div>
        </template>
        <template #default>
          <div>Here are som of the reasons blah blah blah</div>
        </template>
      </StoreCard>
      <StoreCard class="bg-secondary" @click="() => { /**Redirect to Stripe or something */ }">
        <template #header>
          <div class="w-full flex justify-center">
            <div>Buy wisdom treasures for one year!</div>
          </div>
        </template>
        <template #default>
          <div>Here are som of the reasons blah blah blah</div>
        </template>
      </StoreCard>
    </div>
  </main> 
</template>

<script lang="ts">
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import { useSessionStore } from '@/stores/session';
import BaseCard from '@/components/BaseCard.vue';
import StoreCard from '@/components/StoreCard.vue';

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
      BaseCard,
      StoreCard
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