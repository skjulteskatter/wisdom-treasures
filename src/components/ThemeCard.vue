<template>
    <main>
        <BaseCard class="border-2 hover:border-black/30 border-black/0 cursor-pointer" @click="()=>{$router.push({path: `${themesOrCurrentPath}${publication.id}`})}"
          :class="[{'h-full': strechY}]">
          <template #default>
            <div class="h-full flex items-center justify-between">
                <p class="self-center text-base font-bold text-[color:var(--wt-color-text-grey)] tracking-wide w-4/5 truncate">{{ publication.title }}</p>
                <ArrowRightIcon class="h-4 text-[color:var(--wt-color-secondary)]"/>
            </div>
          </template>
        </BaseCard>
    </main>
  </template>
    
  <script lang="ts">
  import type { Publication } from 'hiddentreasures-js';
  import { defineComponent, type PropType } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { useSessionStore } from '@/stores/session';
  import { ArrowRightIcon } from '@heroicons/vue/solid';
  
    export default defineComponent({
      name: "ThemeCard",
      data() {
        return {
          store: useSessionStore(),
        }
      },
      props: {
        publication: {
            type: Object as PropType<Publication>,
            required: true
        },
        strechY: {
            type: Boolean,
            required: false
        },
      },
      components: {
        BaseCard,
        ArrowRightIcon
      },
      computed: {
        themesOrCurrentPath(){
          let path : string = this.$router.getRoutes().find(x => x.name == "themes")?.path ?? this.$route.path;
          path = path.endsWith("/") ? path : path + "/";
          return path;
        },
      },
    });
  </script>