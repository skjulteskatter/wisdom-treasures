<template>
    <main>
        <BaseCard class="border-2 hover:border-black/30 border-black/0 cursor-pointer" @click="()=>{$router.push({path: `${currentPath}${article.number}`})}"
          :class="[{'h-full': strechY}]">
          <template #default>
            <slot name="default" v-if="$slots.default" />
            <div v-else class="flex h-full">
              <p class="self-center line-clamp-3" v-html="smartTrim(article.content?.content ?? '')"/>
            </div>
          </template>
          <template #footer>
            <slot name="footer" v-if="$slots.footer"></slot>
            <div v-else class="flex">
              <div class="self-center mr-2">
                  <BookOpenIcon class="h-6 opacity-40"/>
              </div>
              <div class="self-center opacity-50">
                {{categoryName}}
              </div>
            </div>
            
          </template>
        </BaseCard>
        <WWCardModal :show="openWWModal" @close="(e: Event | undefined) => {navigateBack(e); $emit('closeModal', e)}" :article="article"/>
    </main>
  </template>
    
  <script lang="ts">
  import type { Article } from 'hiddentreasures-js';
  import { defineComponent, type PropType } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { BookOpenIcon } from '@heroicons/vue/outline';
  import WWCardModal from './WWCardModal.vue';
  import { history } from '@/services/localStorage';
import { useSessionStore } from '@/stores/session';
  
    export default defineComponent({
      name: "WWCard",
      data() {
        return {
          openWWModal: false,
          store: useSessionStore(),
        }
      },
      props: {
        article: {
            type: Object as PropType<Article>,
            required: true
        },
        strechY: {
            type: Boolean,
            required: false
        },
      },
      emits: ["closeModal"],
      components: {
        BaseCard,
        BookOpenIcon,
        WWCardModal
      },
      computed: {
        currentPath(){
          return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
        },
        categoryName(): string {
          return this.store.publications.get(this.article.publicationId)?.title ?? "";
        }
      },
      async mounted() {
        this.checkRouteToModal();
      },
      watch: {
        $route(){
          this.checkRouteToModal()
        },
        openWWModal(value){
          if (value == false) return;

          //This is just a test
          history.addOrReplace(this.article.id, Date.now());
        },
      },
      methods:{
        checkRouteToModal(){
          let wwNumber = this.$route.params.wwNumber;
          if (wwNumber !== undefined && +wwNumber === this.article.number){
            this.openWWModal = true;
            this.registerViewedWW();
          } else this.openWWModal = false;
        },
        registerViewedWW(){
          //TODO register somewhere that the user have clicked this specific WW
        },
        navigateBack(e?: Event){

          if (e === undefined || e.defaultPrevented === true) return;

          if (this.$router.options.history.state.back == null){
            this.$router.push({name: "dashboard"});
          } else {
            this.$router.back();
          }
        },
        //Trims space without touching html tags
        smartTrim(s: string): string{
          return s.replace(/(\s*(?=<))|((?<=>)\s*)/g, "");
        }
      }
    });
  </script>