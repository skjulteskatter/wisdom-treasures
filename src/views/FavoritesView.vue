<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      Favorites
    </h1>
    <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(article, index) in favoriteArticles" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true"/>
      </div>
    </div>
  </main> 
</template>

<script lang="ts">
import { getCurrentUserPromise } from '@/services/auth';
import type { User } from '@firebase/auth';
import type { Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import WWCard from '@/components/WWCard.vue';
import { useSessionStore } from '@/stores/session';

  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        publications : [] as Publication[],
        currentUser : null as User | null,
        store: useSessionStore(),
      }
    },
    components: {
      WWCard
    },
    computed: {
      favorites() : string[]{
        return this.store.favorites;
      },
      favoriteArticles(){
        const articles = [];
        for (const favorite of this.favorites) {
          const article = this.store.articles.get(favorite);
          if (article === null || article === undefined) continue;
          articles.push(article);
        }
        return articles;
      }
    },
    watch: {
      articlesMap(){
        //Maybe find a better way than to erase it and fill it again 🤷‍♂️
        console.log("watcher triggered");
        this.favoriteArticles = [];
        for (const favorite of this.favorites) {
          const article = this.store.articles.get(favorite);
          if (article === null || article === undefined) continue;
          this.favoriteArticles.push(article);
        }
      }
    },
    async mounted() {

      this.currentUser = await getCurrentUserPromise() as User;

    },
  });
</script>