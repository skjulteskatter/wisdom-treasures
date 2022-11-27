<template>
    <main class="">
        <BaseCard class="border-2 hover:border-black/30 border-black/0">
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
      name: "WWCard",
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