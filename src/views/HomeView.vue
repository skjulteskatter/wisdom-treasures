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
      }
    },
    async mounted() {

      this.currentUser = await getCurrentUserPromise() as User;

    },
  });
</script>