<template>
    <main>
        <BaseCard class="border-2 hover:border-black/30 border-black/0 cursor-pointer" @click="openWWModal = true"
          :class="[{'h-full': strechY}]">
          <template #default>
            <div class="flex h-full">
              <p class="self-center" v-html="article.content?.content"/>
            </div>
          </template>
          <template #footer>

            <div class="flex">
              <div class="self-center mr-2">
                  <BookOpenIcon class="h-8"/>
              </div>
              <div class="self-center">
                {{article.id}}
              </div>
            </div>
            
          </template>
        </BaseCard>
        <WWCardModal :show="openWWModal" @close="openWWModal = false" :article="article"/>
    </main>
  </template>
    
  <script lang="ts">
  import { Article } from 'hiddentreasures-js';
  import { defineComponent } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { BookOpenIcon } from '@heroicons/vue/outline';
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
        strechY: {
            type: Boolean,
            required: false
        },
      },
      components: {
        BaseCard,
        BookOpenIcon,
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