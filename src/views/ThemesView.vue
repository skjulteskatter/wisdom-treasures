<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      Themes
    </h1>
    <div id="wrapper" class="flex">
      <div>
        <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <div v-for="(publication, index) in publications" :key="index" class="flex flex-col">
            <ThemeCard :publication="publication" class="grow" :strech-y="true"/>
          </div>
        </div>
      </div>
      <div id="alphabetslider">
        <div class="bg-red-200 w-10 flex flex-col sticky top-16 items-center font-bold">
          <div v-for="letter in alphabet" :key="letter">
            <p class="bg-blue-200">{{ letter }}</p>
          </div>
        </div>
      </div>
    </div>
  </main> 
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { useSessionStore } from '@/stores/session';
import ThemeCard from '@/components/ThemeCard.vue';
import type { Publication } from 'hiddentreasures-js';

  export default defineComponent({
    name: "ThemesView",
    data() {
      return {
        store: useSessionStore(),
        dataFavorites : undefined as string[] | undefined,
        alphabet: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
      }
    },
    components: {
      ThemeCard
    },
    computed: {
      publications() : Publication[] | null {
        console.log(this.store.publications.values());
        return Array.from(this.store.publications.values());
      }
    },
    methods: {

    }
  });
</script>