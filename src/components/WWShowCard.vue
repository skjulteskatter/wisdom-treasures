<template>
    <main>
      <BaseCard :class="[WWCardHomeView ? 'min-h-custom flex flex-col justify-between' : '']" :hideFooter="forThemeView">
        <template #header>
          <div class="flex">
                  <div class="grow"/>
                  <div class="self-center">
                    <PopUpMessage class="z-10" :open="openCopyToClipBoardPopUpSemaphore > 0" :text="'Copied to clipboard!'"></PopUpMessage>
                    <BaseButton theme="menuButton" size="small" class="flex w-8 self-center max-h-8 mx-2 opacity-70" @click="() => {copyToClipBoard()}">
                        <ClipboardCopyIcon class="h-8 opacity-50 pop" :key="copyToClipBoardKey"/>
                    </BaseButton>
                  </div>
                  <BaseButton theme="menuButton" size="small" class="flex w-8 self-center max-h-8 mx-2 opacity-70" @click="() => {favoriteButton()}">
                      <HeartIconSolid v-if="favorite" class="h-8 text-[color:var(--wt-color-secondary)] pop"/>
                      <HeartIcon v-else class="h-8 text-[color:var(--wt-color-secondary)] pop"/>
                  </BaseButton>
                </div>
        </template>
        <template #default>
          <div class="flex flex-col h-full sm:items-center">
            <div class="flex max-w-2xl flex-col sm:h-auto justify-center sm:text-center">
                <div class="font-serif sm:grow m-5 leading-6 text-sm" v-html="articleContent"/>
                <div v-if="getArticleYearWritten > 1000 || getAuthor" class="italic text-xs ml-5 sm:ml-0 mb-2 text-[color:var(--wt-color-text-grey)] opacity-70">{{getSignature}}</div>
            </div>
          </div>
        </template>
        <template #footer>
            <div class="w-full flex flex-wrap self-center justify-center text-xs text-[color:var(--wt-color-text-grey)] py-2 opacity-70 tracking-wide">
                {{$t('common.seeMore')}}&nbsp;
                <ClickableLink class="inline-block text-secondary" v-on:link-clicked="navigateToThemePage">{{categoryName}}</ClickableLink>
                <div v-if="originName.length > 0">
                  &nbsp;or
                  <ClickableLink v-if="originName.length > 0" class="inline-block text-secondary" v-on:link-clicked="navigateToOriginPage">{{originName}}</ClickableLink>
                </div>
            </div>
        </template>
    </BaseCard>
    </main>
  </template>
    
  <script lang="ts">
  import type { Article, Contributor } from 'hiddentreasures-js';
  import { defineComponent, type PropType } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { useSessionStore } from '@/stores/session';
  import ClickableLink from './ClickableLink.vue';
  import { uuid } from 'vue-uuid';
  import PopUpMessage from './Notification/PopUpMessage.vue';
  import BaseButton from './BaseButton.vue';
  import { HeartIcon as HeartIconSolid } from '@heroicons/vue/solid';
  import { HeartIcon, ClipboardCopyIcon } from '@heroicons/vue/outline';
  import { log } from '@/services/env'

    export default defineComponent({
      name: "WWShowCard",
      data() {
        return {
          store: useSessionStore(),
          copyToClipBoardKey: uuid.v4() as string,
          openCopyToClipBoardPopUpSemaphore: 0 as number,
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
        customTitle: {
            type: String,
            required: false,
        }, 
        WWCardHomeView: {
            type: Boolean,
            deafult: false,
        },
        forThemeView:{
            type: Boolean,
            default: false
        }
      },
      components: {
        BaseCard,
        ClickableLink,
        PopUpMessage,
        BaseButton,
        HeartIcon,
        HeartIconSolid,
        ClipboardCopyIcon,
      },
      computed: {
        currentPath(){
          return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
        },
        categoryName(): string {
          return this.store.publications.get(this.article?.publicationId)?.title ?? "";
        },
        authorName(): string {
          return this.store.authors.get(this.article.authorId)?.name ?? "";
        },
        originName(): string {
          return this.store.origins.get(this.article.sourceId ?? "")?.name ?? "";
        },
        articleContent() : string {
          return this.smartTrim(this.article.content?.content ?? "");
        },
        favorites(): string[] {
            return this.store.favorites;
        },
        favorite(): boolean{
            return this.store.favorites.includes(this.article.id);
        },
        getArticleYearWritten(): number{
          let date = new Date(this.article.dateWritten);
          return date.getFullYear();
        },
        getAuthor(): Contributor | undefined {
          return Array.from(this.store.authors.values()).find(x => x.id == this.article.authorId);
        },
        getSignature(): string {
          let builder = " - ";
          if (this.getAuthor) builder += this.getAuthor.name + ", ";
          if (this.getArticleYearWritten) builder += this.getArticleYearWritten;
          return builder;
        }
      },
      watch: {
        favorites(newFavs : string[]) {
            this.favorite = newFavs.includes(this.article.id);
        }
      },
      methods: {
        favoriteButton(){
            if (!this.favorite){
                log && console.log("Adding to favorites");
                this.store.addFavorite([this.article.id]);
            } else {
                log && console.log("Removing from favorites");
                this.store.removeFavorite([this.article.id]);
            }
        },
        copyToClipBoard() {
            this.copyToClipBoardKey = uuid.v4();
            if (!this.article.content?.content) return;

            let contentPart = this.article.content?.content.replace(/<.+?>/g, "").trim();
            let yearWritten = this.getArticleYearWritten > 1000 ? this.getArticleYearWritten.toString() : "";
            let tail = [this.authorName, yearWritten, this.originName].filter(x => x.length > 0).join(", ");

            navigator.clipboard.writeText(`${contentPart}${(tail.length > 0) ? "\n-" : ""}${tail}`);

            this.openCopyToClipBoardPopUpSemaphore++;
            setTimeout(() => {
                this.openCopyToClipBoardPopUpSemaphore--;
            }, 2000); // Wait time for popupmessage to dissapear
        },
        smartTrim(s: string): string{
          return s.replace(/(\s*(?=<))|((?<=>)\s*)/g, "");
        },
        navigateToThemePage(){
          let path : string = this.$router.getRoutes().find(x => x.name == "themes")?.path ?? this.$route.path;
          path = path.endsWith("/") ? path : path + "/";
          path += this.article.publicationId;
          this.$router.push({path: path});
        },
        navigateToOriginPage(){
          let path : string = this.$router.getRoutes().find(x => x.name == "origins")?.path ?? this.$route.path;
          path = path.endsWith("/") ? path : path + "/";
          path += this.article.sourceId;
          this.$router.push({path: path});
        },
      },
    });
  </script>

<style scoped>
.min-h-custom{
  min-height: max(28rem, 64vh)
}
@media(min-width:640px){
  .min-h-custom{
    min-height:auto;
  }
}
</style>
