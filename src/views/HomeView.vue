<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      <span v-if="currentUser" class="font-bold">
        Welcome, 
        <span class="animated-gradient font-bold cursor-pointer" @click="$router.push({name: 'profile'})">
          {{currentUser.displayName}}
        </span> 
      </span>
      <span v-else class="font-bold"> 
        Welcome to 
        <span class="animated-gradient font-bold">
          WisdomTreasures
        </span> 
      </span>
    </h1>
    <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(article, index) in articles" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true"/>
      </div>
    </div>
    <WWCard id="placeHolderWWforlinkedwords" v-if="linkedArticle !== null" :article="linkedArticle" class="hidden"/>
  </main> 
</template>

<script lang="ts">
import { getCurrentUserPromise } from '@/services/auth';
import type { User } from '@firebase/auth';
import type { Article, Publication } from 'hiddentreasures-js';
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
      articles() : Article[] {
        return Array.from(this.store.articles.values());
      },
      linkedArticle(): null | Article {
        const articleId = this.store.articleNumberLookup.get(this.currentPathNumber || -1);
        if (articleId == undefined) return null;
        if (this.articles.some(x => x.id == articleId)) return null;
        const article = this.store.articles.get(articleId || "");
        if (article === undefined) return null;
        return article;
      },
      currentPath() : string {
          return !this.$route.path.endsWith("/") ? this.$route.path : this.$route.path.slice(0 , this.$route.path.length - 1);
        },
      currentPathNumber() : number | null {
        let match = (this.currentPath.match(/[0-9]+$/) ?? [null])[0];
        if (match == null) return null;
        return parseInt(match);
      }
    },
    async mounted() {
      this.currentUser = await getCurrentUserPromise() as User;

    },
  });
</script>