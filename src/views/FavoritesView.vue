<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-4 sm:top-20 left-0 z-40 w-full h-0">
        <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50"/>
        <ScrollToTopButton class="fixed top-0 h-max"/>
        <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50"/>
    </div>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center py-4 mb-5 sm:mb-0">
      <BackButton />
      <h1 class="absolute left-0 right-0 text-center text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">
        {{$t('common.favorites')}}
      </h1>
    </div>
    <div v-if="favoriteArticles.length > 0" id="WWCards" class="px-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(article, index) in favoriteArticles" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true" @close-modal="sync()"/>
      </div>
    </div>
    <div v-else class="grow flex flex-col">
      <div class="grow" />
      <QuestionMarkCircleIcon class="w-20 grayscale opacity-80 place-self-center" />
      <div class="place-self-center">Looks like you don't have any favorites </div>
      <div class="grow" />
    </div>
  </main> 
</template>

<script lang="ts">
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import WWCard from '@/components/WWCard.vue';
import { useSessionStore } from '@/stores/session';
import BackButton from '@/components/BackButton.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/outline';

  export default defineComponent({
    name: "FavoriteView",
    data() {
      return {
        publications : [] as Publication[],
        store: useSessionStore(),
        temporaryFavorites : [] as string[],
      }
    },
    components: {
      WWCard,
      BackButton,
      QuestionMarkCircleIcon,
    },
    computed: {
      storeFavorites() : string[]{
        return this.store.favorites;
      },
      favorites() : string[]{
        return [... new Set(this.temporaryFavorites.concat(this.storeFavorites))];
      },
      favoriteArticles() : Article[] {
        let list: Article[] = [];
        for (const favorite of this.favorites) {
          const article = this.store.articles.get(favorite);
          if (article === undefined) continue
          list.push(article);
        }

        return list.sort((a,b) => (a.content?.content ?? "⛄").localeCompare(b.content?.content ?? "⛄"));
      },
    },

    methods: {
      sync(){
        this.temporaryFavorites = [];
        for (const id of this.store.favorites) {
          this.temporaryFavorites.push(id);
        }
      }
    },
    mounted(){
      this.sync();
    }
  });
</script>