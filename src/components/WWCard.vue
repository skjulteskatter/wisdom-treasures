<template>
    <main>
        <BaseCard class="border-2 hover:border-black/30 border-black/0 cursor-pointer" @click="()=>{$router.push({path: `${currentPath}${article.number}`})}"
          :class="[{'h-full': strechY}]">
          <template #default>
            <slot name="default" v-if="$slots.default" />
            <div v-else class="flex h-full">
              <p class="self-center" v-html="article.content?.content"/>
            </div>
          </template>
          <template #footer>
            <slot name="footer" v-if="$slots.footer"></slot>
            <div v-else class="flex">
              <div class="self-center mr-2">
                  <BookOpenIcon class="h-8"/>
              </div>
              <div class="self-center">
                {{article.id}}
              </div>
            </div>
            
          </template>
        </BaseCard>
        <WWCardModal :show="openWWModal" @close="navigateBack" :article="article"/>
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
        },
        currentPath(){
          return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
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
          localStorage.setItem('history:' + this.article.id, Date.now().toString());
        }
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
        navigateBack(){
            if (this.$router.options.history.state.back == null){
              this.$router.push({name: "dashboard"});
            } else {
              this.$router.back();
            }
        }
      }
    });
  </script>