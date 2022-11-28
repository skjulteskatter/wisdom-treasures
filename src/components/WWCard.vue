<template>
    <main class="">
        <BaseCard class="border-2 hover:border-black/30 border-black/0 cursor-pointer" @click="openWWModal = true">
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
        <WWCardModal v-if="openWWModal" @close="openWWModal = false" :article="article">

        </WWCardModal>
    </main>
  </template>
    
  <script lang="ts">
  import { Article } from 'hiddentreasures-js';
  import { defineComponent } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { PencilAltIcon } from '@heroicons/vue/solid';
  import WWCardModal from './WWCardModal.vue';
  
    export default defineComponent({
      name: "WWCard",
      data() {
        return {
          openWWModal: false,
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
        WWCardModal
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