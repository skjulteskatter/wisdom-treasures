<template>
  <main class="">
      <BaseCard class="hover:border-2 border-black/30">
        <template #default>
          <PencilAltIcon/>
          {{article.content}}
        </template>
        <template #footer>
          {{article.id}}
        </template>
      </BaseCard>
  </main>
</template>
  
<script lang="ts">
import type { Article } from 'hiddentreasures-js';
import { defineComponent, type PropType } from 'vue';
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
          type: Object as PropType<Article>,
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