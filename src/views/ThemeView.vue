<template>
  <main>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center justify-between">
      <BackButton/>
      <h1 class="my-4 sm:my-6 text-base sm:text-3xl font-bold text-white sm:text-inherit tracking-wide">
        {{ publication?.title ?? "" }}
      </h1>
      <BackButton class="opacity-0" disabled="true"/>
    </div>

    <h1 class="m-5 sm:mx-0 text-base font-bold tracking-075 my-5 sm:mt-0 text-[color:var(--wt-color-text-grey)] opacity-80">Wisdom Manna in the topic:</h1>
    <WWShowCard v-if="randomArticle" :article="randomArticle" class="mx-5 my-5 sm:mx-0" :forThemeView="true"/>
    <ThreeDButton size="large" :three-d="true" @clicked="getAndSetRandomArticle" class="mx-5 sm:mx-0">
      <p class="text-base font-bold tracking-wide">Get Wisdom Manna</p>
    </ThreeDButton>

    <h1 class="m-5 sm:mx-0 text-base font-bold tracking-075 text-[color:var(--wt-color-text-grey)] opacity-80">Search in the topic:</h1>
    <MultiSearch 
        :initial-theme-filter="[$route.params.themeId]"
        @articles:article-hits="setSearchArticles" 
        @searched-word:searched-word=""
        @search-loading:search-loading=""
        class="mx-5 sm:mx-0">
    </MultiSearch>

    <div id="WWCards" class="px-5 pt-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      <div v-for="(article, index) in searchOrAllArticles" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true"/>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import WWCard from '@/components/WWCard.vue';
import { useSessionStore } from '@/stores/session';
import router from '@/router';
import { Notification } from '@/classes/notification';
import BackButton from '@/components/BackButton.vue';
import ThreeDButton from '@/components/ThreeDButton.vue';
import { RefreshIcon } from '@heroicons/vue/outline';
import WWShowCard from '@/components/WWShowCard.vue';
import { mannaHistory } from '@/services/localStorage';
import MultiSearch from '@/components/MultiSearch.vue';

  export default defineComponent({
    name: "ThemeView",
    data() {
      return {
        store: useSessionStore(),
        dataFavorites : undefined as string[] | undefined,
        publication: undefined as Publication | undefined,
        randomArticle : null as Article | null,
        showWordOfTheDay : false as boolean,
        searchArticles: [] as Article[],
      }
    },
    components: {
      WWCard,
      BackButton,
      ThreeDButton,
      RefreshIcon,
      WWShowCard,
      MultiSearch
    },
    computed: {
      searchOrAllArticles(): Article[]{
        if (this.searchArticles.length > 0) return this.searchArticles;
        return this.articles;
      },
      storeFavorites() : string[]{
        return this.store.favorites;
      },
      currentPath() : string {
          return !this.$route.path.endsWith("/") ? this.$route.path : this.$route.path.slice(0 , this.$route.path.length - 1);
      },
      homePath(): string {
        let route = (router.getRoutes().find(x => x.name == 'dashboard')?.path || "⛄");
        return !route.endsWith("/") ? route : route.slice(0 , route.length - 1);
      },
      currentPathNumber() : number | null {
        let match = (this.currentPath.match(/[0-9]+$/) ?? [null])[0];
        if (match == null) return null;
        return parseInt(match);
      },
      sessionInitialized() : boolean {
        return this.store.sessionInitialized;
      },
      articles() : Article[]{
        const articles: Article[] = [];
        if (this.publication === undefined) return articles;
        return Array.from(this.store.articles.values()).filter(x => x.publicationId == this.publication?.id)
      },
    },
    watch: {
      sessionInitialized(oldVal, newVal){
        if (!newVal) return;
        console.log(this.$route.params.themeId.toString());
        this.getAndSetPublication();
        this.assureCorrectSlug();
        this.assureCorrectArticleNumber();
      }
    },
    methods: {
      setSearchArticles(value : Article[]){
            this.searchArticles = value;
      },
      refreshDataFavorites(){
        this.dataFavorites = [...this.storeFavorites];
      },
      getAndSetPublication(){
        this.publication = this.store.publications.get(this.$route.params.themeId.toString());
      },
      assureCorrectSlug(){
        if (this.publication !== undefined){
          const fullPath = this.$route.fullPath;
          let urlSlug : string = this.$route.params.themeAutoSlug?.toString() ?? "";
          let newPath : string = "";
          if (urlSlug.length > 0)
            newPath = fullPath.replace(this.$route.params.themeAutoSlug.toString(),this.getFakeSlug(this.publication.title));
          else
            newPath = `${fullPath}${fullPath.endsWith("/") ? "" : "/"}${this.getFakeSlug(this.publication.title)}`;

          this.$router.replace({path: newPath})          
        }
      },
      assureCorrectArticleNumber(){
        if (this.$route.params.wwNumber === undefined) return;
        let articleNumber : number = (+this.$route.params.wwNumber?.toString());
        
        let articleExist : boolean = false;
        if (!Number.isNaN(articleNumber)){
          for (const article of this.articles) {
            if (article.number == articleNumber) {
              articleExist = true;
              break;
            } 
          }
        }

        if (!articleExist)
          this.articleNotFound(articleNumber);
      },
      getFakeSlug(text: string) : string {
        return text
          .toString()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-');
      },
      articleNotFound(num: number) : void{
        //Should probably navigate back 🤷‍♂️
        let message = Number.isNaN(num) ? "Couldn't find article" : "Couldn't find article number: " + num.toString();
        this.store.notifications.push(new Notification(message, "error"));
        router.replace({path: this.$route.fullPath.replace(this.$route.params.wwNumber?.toString() ?? "", "") });
      },
      getAndSetRandomArticle(): void {
        this.randomArticle = this.articles[Math.floor(Math.random()*this.articles.length)] || null;
        mannaHistory.addOrReplace(this.randomArticle.id);
        this.showWordOfTheDay = false;
      },
    },
    mounted(){
      if (this.sessionInitialized){
        this.getAndSetPublication();
        this.assureCorrectSlug();
        this.assureCorrectArticleNumber();
      }
    }
  });
</script>
