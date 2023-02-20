<template>
    <main>
        <BaseCard class="border-2 hover:border-black/30 border-black/0 cursor-pointer" @click="()=>{$router.push({path: `${themesOrCurrentPath}${publication.id}`})}"
          :class="[{'h-full': strechY}]">
          <template #default>
            <div class="h-full flex">
                <p class="self-center text-xl font-bold">{{ publication.title }}</p>
            </div>
          </template>
        </BaseCard>
    </main>
  </template>
    
  <script lang="ts">
  import { Publication } from 'hiddentreasures-js';
  import { defineComponent } from 'vue';
  import BaseCard from './BaseCard.vue';
import { useSessionStore } from '@/stores/session';
  
    export default defineComponent({
      name: "ThemeCard",
      data() {
        return {
          store: useSessionStore(),
        }
      },
      props: {
        publication: {
            type: Publication,
            required: true
        },
        strechY: {
            type: Boolean,
            required: false
        },
      },
      components: {
        BaseCard
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