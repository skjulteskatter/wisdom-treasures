<template>
    <main>
        <BaseCard :WWCard="true" class="border-2 border-black/0 cursor-pointer" @click="()=>{$router.push({path: `${currentPath}${article.number}`})}"
          :class="[{'h-full': strechY}, {'hover:border-black/30' : !hoverOverFavorite}]">
          <template #default>
            <slot name="default" v-if="$slots.default" />
            <div v-else class="flex h-full">
              <p class="self-center line-clamp-3" v-html="smartTrim(article.content?.content ?? '')"/>
            </div>
          </template>
          <template #footer>
            <slot name="footer" v-if="$slots.footer"></slot>
            <div v-else class="flex justify-between">
              <div class="self-center mr-2">
                  <BookOpenIcon class="h-5 opacity-40"/>
              </div>
              <div class="text-xs self-center opacity-50 truncate w-4/5">
                {{categoryName}}{{ authorName }}{{ originName }}
              </div>
              <div id="forStyling" class="grow"/>
              <BaseButton theme="menuButton" size="small" class="flex w-8 self-center max-h-8 mx-2 opacity-70" @mouseover="()=>{hoverOverFavorite = true}" @mouseleave="()=>{hoverOverFavorite = false}" @click="(e: Event | undefined) => {e?.stopPropagation(); favoriteButton();}">
                <HeartIconSolid v-if="favorite" class="h-8 text-[color:var(--wt-color-secondary)] pop"/>
                <HeartIcon v-else class="h-8 text-[color:var(--wt-color-secondary)] pop"/>
              </BaseButton>
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
  import { BookOpenIcon, HeartIcon } from '@heroicons/vue/outline';
  import WWCardModal from './WWCardModal.vue';
  import { useSessionStore } from '@/stores/session';
  import { HeartIcon as HeartIconSolid } from '@heroicons/vue/solid';
  import BaseButton from './BaseButton.vue';
  
    export default defineComponent({
      name: "WWCard",
      data() {
        return {
          openWWModal: false,
          store: useSessionStore(),
          hoverOverFavorite: false as boolean,
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
        WWCardModal,
        HeartIcon,
        HeartIconSolid,
        BaseButton
      },
      computed: {
        favorite() : boolean {
          return this.store.favorites.includes(this.article.id);
        },
        currentPath(){
          return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
        },
        categoryName(): string {
          return this.store.publications.get(this.article.publicationId)?.title ?? "";
        },
        authorName(): string{
          let name = this.store.authors.get(this.article.authorId)?.name ?? "";
          return name.length > 0 ? ` - ${name}` : "";
        },
        originName(): string{
          let name = this.store.origins.get(this.article.sourceId ?? "")?.name ?? "";
          return name.length > 0 ? ` - ${name}` : "";
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
          let wwNumber = this.$route.params.wwNumber;
          if (wwNumber !== undefined && +wwNumber === this.article.number){
            this.openWWModal = true;
          } else this.openWWModal = false;
        },
        favoriteButton(): void
        {
          if (this.favorite){
            console.log("before:", this.store.favorites)
            this.store.favorites = this.store.favorites.filter(x => x != this.article.id);
            console.log("after:", this.store.favorites)
          } else {
            this.store.favorites.push(this.article.id);
          }
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