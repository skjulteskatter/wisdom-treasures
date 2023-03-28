<template>
    <main>
      <BaseCard>
        <template #default>  
          <div class="flex">
            <div id="spacerdiv1" class="flex grow"/>
            <div class="flex max-w-2xl flex-col font-serif sm:h-auto justify-center">
                <div class="flex self-center">
                  <!--Using v-show instead of v-if to make smoother transition between the two-->
                  <p v-show="customTitle" class="self-center font-bold text-3xl mt-3">{{ customTitle }}</p>
                  <img v-show="!customTitle" src="/img/quote.svg" alt="“" class="self-center max-h-10 mt-2"/>
                </div>
                <div class="sm:grow m-5" v-html="articleContent"/>
            </div>
            <div id="spacerdiv2" class="flex grow"/>
          </div>
        </template>
        <template #footer>
            <div class="w-full flex">
                <div class="grow self-center flex">See more from&nbsp;
                    <ClickableLink class="inline-block" v-on:link-clicked="navigateToThemePage">{{categoryName}}</ClickableLink>
                    &nbsp;category&nbsp;
                    <div v-if="getArticleYearWritten > 1000 || getAuthor" class="italic">{{getSignature}}</div>
                </div> 
                <div>
                    <PopUpMessage class="z-10" :open="openCopyToClipBoardPopUpSemaphore > 0" :text="'Copied to clipboard!'"></PopUpMessage>
                    <BaseButton theme="menuButton" size="small" class="hidden sm:block w-8 self-center max-h-8 mx-2" @click="() => {copyToClipBoard()}">
                        <ClipboardCopyIcon class="h-8 opacity-50 pop" :key="copyToClipBoardKey"/>
                    </BaseButton>
                </div>
                  <BaseButton theme="menuButton" size="small" class="hidden sm:block w-8 self-center max-h-8 mx-2" @click="() => {favoriteButton()}">
                      <HeartIconSolid v-if="favorite" class="h-8 error-color-filter pop"/>
                  <HeartIcon v-else class="h-8 opacity-50 pop"/>
                </BaseButton>
            </div>
        </template>
    </BaseCard>
    </main>
  </template>
    
  <script lang="ts">
  import { Article, Contributor } from 'hiddentreasures-js';
  import { defineComponent } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { useSessionStore } from '@/stores/session';
  import ClickableLink from './ClickableLink.vue';
  import { uuid } from 'vue-uuid';
  import PopUpMessage from './PopUpMessage.vue';
  import BaseButton from './BaseButton.vue';
  import { HeartIcon as HeartIconSolid } from '@heroicons/vue/solid';
  import { HeartIcon, ClipboardCopyIcon } from '@heroicons/vue/outline';

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
            type: Article,
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
          if (this.getAuthor) builder += this.getAuthor.name + " ";
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
                console.log("Adding to favorites");
                this.store.addFavorite([this.article.id]);
            } else {
                console.log("Removing from favorites");
                this.store.removeFavorite([this.article.id]);
            }
        },
        copyToClipBoard() {
            this.copyToClipBoardKey = uuid.v4();
            if (!this.article.content?.content) return;
            navigator.clipboard.writeText(`${this.article.content?.content.replace(/<.+?>/g, "").trim()}
            ${(this.authorName != '' ? ' - ' + this.authorName : '')}
            ${(this.getArticleYearWritten) > 1000 ? " " + this.getArticleYearWritten.toString() : ""}`);

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
      },
    });
  </script>