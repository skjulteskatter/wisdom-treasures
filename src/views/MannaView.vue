<template>
    <main>
      <h1 class="my-6 text-3xl font-bold">
        Manna
      </h1>
      <div id="wordOfTheDayCotainer" class="mt-20 mb-20 grid sm:grid-cols-3 grid-cols-1 sm:gap-2">
        <ThreeDButton size="large" :three-d="true" @clicked="getManna" class="mt-2 sm:mt-0 mx-2 sm:mx-0">
          <p class="text-xl">Generate new word</p>
          <template #icon>
            <RefreshIcon class="w-8"/>
          </template>
        </ThreeDButton>
      </div>
    </main> 
  </template>
  
  <script lang="ts">
  import { getCurrentUserPromise } from '@/services/auth';
  import type { User } from '@firebase/auth';
  import { defineComponent } from 'vue';
  import { useSessionStore } from '@/stores/session';
  import ThreeDButton from '@/components/ThreeDButton.vue';
  import { RefreshIcon } from '@heroicons/vue/outline';
  import { getManna } from '@/services/manna';
  
    export default defineComponent({
      name: "HomeView",
      data() {
        return {
          currentUser : null as User | null,
          store: useSessionStore(),
        }
      },
      components: {
        ThreeDButton,
        RefreshIcon
      },
      computed: {
        sessionInitialized() : boolean {
          return this.store.sessionInitialized;
        }
      },
      watch: {
        sessionInitialized(initialized){
          if (initialized) {
            console.log("Initialized");
          }
        }
      },
      async mounted() {
        this.currentUser = await getCurrentUserPromise() as User;
      },
      methods:{
        async getManna(){
          await getManna();
        }
      },
    });
  </script>