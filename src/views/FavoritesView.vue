<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-4 sm:top-20 left-0 z-40 w-full h-0">
        <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50"/>
        <ScrollToTopButton class="fixed top-0 h-max"/>
        <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50"/>
    </div>

    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center py-4 mb-5 sm:mb-0">
      <BackButton />
      <h1 class="absolute left-0 right-0 text-center text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">
        {{$t('common.favorites')}}
      </h1>
    </div>

    <ToggleSlideButton :label="'Show audio files'" class="sm:w-1/2 mb-6 mx-10 sm:ml-auto sm:mr-auto" v-model="showAudioClips"/>

    <div v-show="!showAudioClips" v-if="favoriteArticles.length > 0" id="WWCards" class="px-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(article, index) in favoriteArticles" :key="index" class="flex flex-col">
        <WWCard :article="article" class="grow" :strech-y="true" @close-modal="sync()"/>
      </div>
    </div>
    <div v-show="showAudioClips" v-if="favoriteAudioClips.length > 0" id="WWCards" class="px-5 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(audioClip, index) in favoriteAudioClips" :key="index" class="flex flex-col">
        <AudioCard :audio-clip="audioClip" class="grow" :strech-y="true" @close-modal="sync()"/>
      </div>
    </div>
    <div v-if="favoriteArticles.length + favoriteAudioClips.length <= 0" class="grow flex flex-col">
      <div class="grow" />
      <QuestionMarkCircleIcon class="w-20 grayscale opacity-80 place-self-center" />
      <div class="place-self-center">Looks like you don't have any favorites </div>
      <div class="grow" />
    </div>
  </main> 
</template>

<script lang="ts">
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';
import WWCard from '@/components/WWCard.vue';
import { useSessionStore } from '@/stores/session';
import BackButton from '@/components/BackButton.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/outline';
import { InlineNotification } from '@/classes/notification';
import ToggleSlideButton from '@/components/ToggleSlideButton.vue';
import type { AudioClip } from '@/classes/AudioClip';
import AudioCard from '@/components/AudioCard.vue';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';

  export default defineComponent({
    name: "FavoriteView",
    data() {
      return {
        publications : [] as Publication[],
        store: useSessionStore(),
        temporaryFavorites : [] as string[],
        showAudioClips: false as boolean,
      }
    },
    components: {
      WWCard,
      BackButton,
      QuestionMarkCircleIcon,
      ToggleSlideButton,
      AudioCard,
      ScrollToTopButton
    },
    computed: {
      storeFavorites() : string[]{
        return this.store.favorites;
      },
      favorites() : string[]{
        return [... new Set(this.temporaryFavorites.concat(this.storeFavorites))];
      },
      favoriteArticles() : Article[] {
        let list: Article[] = [];
        for (const favorite of this.favorites) {
          const article = this.store.articles.get(favorite);
          if (article === undefined) continue
          list.push(article);
        }

        return list.sort((a,b) => (a.content?.content ?? "⛄").localeCompare(b.content?.content ?? "⛄"));
      },
      favoriteAudioClips() : AudioClip[] {
        let list: AudioClip[] = [];
        for (const favorite of this.favorites) {
          const audioClip = this.store.audioClips.get(favorite);
          if (audioClip === undefined) continue
          list.push(audioClip);
        }

        return list.sort((a,b) => (a.title ?? "⛄").localeCompare(b.title ?? "⛄"));
      },
      currentPath(): string {
        return !this.$route.path.endsWith("/") ? this.$route.path : this.$route.path.slice(0, this.$route.path.length - 1);
      },
      homePath(): string {
        let route = (this.$router.getRoutes().find(x => x.name == 'favorites')?.path || "⛄");
        return !route.endsWith("/") ? route : route.slice(0, route.length - 1);
      },
      currentPathNumber(): number | null {
        let match = (this.currentPath.match(/[0-9]+$/) ?? [null])[0];
        if (match == null) return null;
        return parseInt(match);
      },
      sessionInitialized(): boolean {
        return this.store.sessionInitialized;
      },
    },

    watch: {
      sessionInitialized(initialized) {
        if (initialized) {
          this.checkArticleNumberPath();
        }
      }
    },

    methods: {
      sync(){
        this.temporaryFavorites = [];
        for (const id of this.store.favorites) {
          this.temporaryFavorites.push(id);
        }
      },
      articleNotFound(num: number): void {
        this.store.notifications.push(new InlineNotification(this.$t('home.couldNotFindArticleNumber') + num.toString(), "error"));
        this.$router.push({ name: "favorites" });
      },
      checkArticleNumberPath() {
        if (this.homePath === this.currentPath) return;
      
        const articleId = this.store.articleNumberLookup.get(this.currentPathNumber || NaN);
        if (articleId === undefined) {
          this.articleNotFound(this.currentPathNumber || NaN);
          return;
        }

        if ((this.favoriteArticles.some(x => x.id == articleId))) return;

        this.articleNotFound(this.currentPathNumber || NaN);
      },
    },
    mounted(){
      this.sync();
      if (this.sessionInitialized) this.checkArticleNumberPath();
    }
  });
</script>