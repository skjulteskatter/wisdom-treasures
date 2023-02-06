<template>
    <main>
      <BaseCard>
        <template #footer>
            <div class="w-full flex">
                <div class="grow self-center">See more from
                    <ClickableLink class="inline-block" v-on:link-clicked="$router.push({name: 'category'})">{{categoryName}}</ClickableLink>
                    category
                </div> 
            </div>
        </template>
        <template #default>  
          <div class="flex">
            <div id="spacerdiv1" class="flex grow"/>
            <div class="flex max-w-2xl flex-col font-serif">
                <img src="/img/quote.svg" alt="“" class="self-center max-h-10 mt-2"/>
                <div class="grow m-5" v-html="articleContent"/>
            </div>
            <div id="spacerdiv2" class="flex grow"/>
          </div>
        </template>
    </BaseCard>
    </main>
  </template>
    
  <script lang="ts">
  import { Article } from 'hiddentreasures-js';
  import { defineComponent } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { history } from '@/services/localStorage';
  import { useSessionStore } from '@/stores/session';
  import ClickableLink from './ClickableLink.vue';
  
    export default defineComponent({
      name: "WWShowCard",
      data() {
        return {
          openWWModal: false,
          store: useSessionStore(),
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
        ClickableLink,

      },
      computed: {
        currentPath(){
          return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
        },
        categoryName(): string {
          return this.store.publications.get(this.article?.publicationId)?.title ?? "";
        },
        articleContent() : string {
          if (!this.article) return "";
          return this.article.content?.content || "";
        }
      },
    });
  </script>