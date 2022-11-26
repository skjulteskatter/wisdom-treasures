<template>
    <main class="">
        <BaseCard class="hover:border-2 border-black/30">
          <template #default>
            <PencilAltIcon class="w-5"/>
            <p class="serif">
                {{article.content?.content}}
            </p>
          </template>
          <template #footer>
            {{article.id}}
          </template>
        </BaseCard>
    </main>
  </template>
    
  <script lang="ts">
  import { Article } from 'hiddentreasures-js';
  import { defineComponent } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { PencilAltIcon } from '@heroicons/vue/solid';
  
    export default defineComponent({
      name: "SearchArticleCard",
      data() {
        return {
        }
      },
      props: {
        article: {
            type: Article,
            required: true
        },
      },
      components: {
        BaseCard,
        PencilAltIcon,
      },
      computed: {
        shortContent() {
          return ""
        }
      },
      async mounted() {
      },
    });
  </script>