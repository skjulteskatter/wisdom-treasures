<template>
    <main class="mt-4">
      <BackButton/>
      <h1 class="my-6 text-3xl font-bold">History</h1>
      <div class="flex flex-col">
        
        <div v-for="(value, key) in periods" :key="key">
          <div class="text-2xl font-bold">{{key}}</div>
          <div class="border-l-2 pl-4 ml-4 my-3 border-black/50" >
            <div class="" v-for="article in getArticlesFromDays(value)" :key="article.id">
              <WWCard :article="article" class="my-2"/>
            </div>
          </div>
        </div>

      </div>
    </main>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import BackButton from '@/components/BackButton.vue';
  import { useSessionStore } from '@/stores/session';
  import WWCard from '@/components/WWCard.vue';
import type { Article } from 'hiddentreasures-js';
import TestArticles from '@/services/TestArticles';
  
    export default defineComponent({
      name: "SearchView",
      data() {
          return {
              store: useSessionStore(),
              articles: [] as Article[],
              periods: {
                "Today": 0,
                "This Week": 7,
                "This Month": 30,
                "This Year": 365,
                "Earlier": 2000
              }
          }
      },
      props: {
      },
      components: {
          BackButton,
          WWCard
      },
      computed: {

      },
      watch : {
      },
      mounted() {
        this.articles = TestArticles;
      },
      methods: {
        getArticlesFromDays(days: number) : Article[]{
          console.log("Articles from days: ", days);
          return this.articles.slice(0,3);
        }
      }
    });
  </script>
  
  <style>
  </style>