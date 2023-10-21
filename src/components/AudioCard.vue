<template>
    <main>
        <BaseCard :WWCard="true" class="border-2 border-black/0"
          :class="[{'h-full': strechY}]">
          <template #header>
            <slot name="header" v-if="$slots.header" />
            <div v-else class="flex h-full">
              <p class="self-center line-clamp-3 font-sans text-base">{{ audioClip.title }}</p>
            </div>
          </template>
          <template #default>
            <slot name="default" v-if="$slots.default" />
            <AudioPlayer :audioClip="audioClip"></AudioPlayer>
          </template>
          <template #footer>
            <div>
              <div class="w-full flex flex-wrap text-xs text-[color:var(--wt-color-text-grey)] py-2 opacity-70 tracking-wide">
                <MicrophoneIcon class="h-5 self-center mr-2 opacity-60"/>
                <div class="flex place-items-center">
                  <ClickableLink class="inline-block text-secondary" v-on:link-clicked="navigateToThemePage">{{categoryName}}</ClickableLink>
                  &nbsp;
                  <ClickableLink v-if="originName.length > 0" class="inline-block text-secondary" v-on:link-clicked="navigateToOriginPage">{{originName}}</ClickableLink>
                  {{ authorName }}
                </div>
              <div id="forStyling" class="grow"/>
                <BaseButton theme="menuButton" size="small" class="place-items-center flex w-8 self-center max-h-8 mx-2 opacity-70" @click="() => {favoriteButton()}">
                        <HeartIconSolid v-if="favorite" class="h-8 text-[color:var(--wt-color-secondary)] pop"/>
                        <HeartIcon v-else class="h-8 text-[color:var(--wt-color-secondary)] pop"/>
                </BaseButton>
              </div>
            </div>
          </template>
        </BaseCard>
    </main>
  </template>
    
  <script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { useSessionStore } from '@/stores/session';
  import AudioPlayer from './AudioPlayer.vue';
  import type { AudioClip } from '@/classes/AudioClip';
  import BaseButton from './BaseButton.vue';
  import ClickableLink from './ClickableLink.vue';
  import { HeartIcon as HeartIconSolid } from '@heroicons/vue/solid';
  import { HeartIcon, MicrophoneIcon } from '@heroicons/vue/outline';
  import { log } from '@/services/logger'
  
    export default defineComponent({
      name: "AudioCard",
      data() {
        return {
          openWWModal: false,
          store: useSessionStore(),
        }
      },
      props: {
        audioClip: {
            type: Object as PropType<AudioClip>,
            required: true
        },
        strechY: {
            type: Boolean,
            required: false
        },
      },
      components: {
        BaseCard,
        AudioPlayer,
        BaseButton,
        ClickableLink,
        HeartIconSolid,
        HeartIcon,
        MicrophoneIcon
      },
      computed: {
        currentPath(){
          return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
        },
        categoryName(): string {
          return this.store.publications.get(this.audioClip.publicationId)?.title ?? "";
        },
        favorite() : boolean {
          return this.store.favorites.includes(this.audioClip.id);
        },
        authorName(): string{
          let name = this.store.authors.get(this.audioClip.authorId)?.name ?? "";
          return name.length > 0 ? ` - ${name}` : "";
        },
        originName(): string{
          let name = this.store.origins.get(this.audioClip.sourceId ?? "")?.name ?? "";
          return name.length > 0 ? ` - ${name}` : "";
        },

      },
      methods:{
        favoriteButton(){
            if (!this.favorite){
                log && console.log("Adding to favorites");
                this.store.addFavorite([this.audioClip.id]);
            } else {
                log && console.log("Removing from favorites");
                this.store.removeFavorite([this.audioClip.id]);
            }
        },
        navigateToThemePage(){
          let path : string = this.$router.getRoutes().find((x: { name: string; }) => x.name == "themes")?.path ?? this.$route.path;
          path = path.endsWith("/") ? path : path + "/";
          path += this.audioClip.publicationId;
          this.$router.push({path: path});
        },
        navigateToOriginPage(){
          let path : string = this.$router.getRoutes().find((x: { name: string; }) => x.name == "origins")?.path ?? this.$route.path;
          path = path.endsWith("/") ? path : path + "/";
          path += this.audioClip.sourceId;
          this.$router.push({path: path});
        },
      }
    });
  </script>