<template>
    <main>
        <BaseButton @click="()=>{$router.push({path: `${currentPath}manna`})}" theme="wisdomMannaBtn">
          Get Manna
        </BaseButton>
        <WWCardModal :show="showMannaModal" @close="(e: Event | undefined) => {navigateBack(e); $emit('closeModal', e)}" :mannaArticleIdList="mannaArticleIdList" :article="store.articles.get(mannaArticleIdList[Math.floor(Math.random() * mannaArticleIdList.length)])!"/>
    </main>
  </template>
    
  <script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import WWCardModal from './WWCardModal.vue';
  import { useSessionStore } from '@/stores/session';
import BaseButton from './BaseButton.vue';
  
    export default defineComponent({
      name: "MannaButton",
      data() {
        return {
          showMannaModal: false,
          store: useSessionStore(),
        }
      },
      props: {
        strechY: {
            type: Boolean,
            required: false
        },
        mannaArticleIdList: {
            type: Array as PropType<Array<string>>,
            required: true,
        },
      },
      emits: ["closeModal"],
      components: {
        WWCardModal,
        BaseButton,
      },
      computed: {
        currentPath(){
          return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
        },
      },
      async mounted() {
        this.checkRouteToModal();
      },
      watch: {
        $route(){
          this.checkRouteToModal()
        },
      },
      methods:{
        checkRouteToModal(){
          let manna = this.$route.params.mannaPath;
          if (manna != undefined && manna != null && manna != ""){
            this.showMannaModal = true;
          } else this.showMannaModal = false;
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