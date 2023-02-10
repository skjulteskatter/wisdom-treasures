<template>
    <main>
      <h1 class="my-6 text-3xl font-bold">
        Manna
      </h1>
      <div id="wordOfTheDayCotainer" class="mt-20 mb-20 grid sm:grid-cols-3 grid-cols-1 sm:gap-2">
        <MannaShowCard v-if="manna != null" :manna="manna" class="col-span-2"></MannaShowCard>
        <ThreeDButton size="large" :three-d="true" @clicked="getAndSetManna" :loading="loadingManna !== undefined && loadingManna === true" class="mt-2 sm:mt-0 mx-2 sm:mx-0">
          <div class="text-xl">
            <p v-if="loadingManna">Retrieving Manna...</p>
            <p v-else>Get Manna</p>
          </div>
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
  import { getTestManna } from '@/services/mannaService.js';
  import type { Manna } from '@/classes/manna';
  import MannaShowCard from '@/components/MannaShowCard.vue';
  
    export default defineComponent({
      name: "HomeView",
      data() {
        return {
          currentUser : null as User | null,
          store: useSessionStore(),
          manna: null as Manna | null,
          loadingManna: false as Boolean
        }
      },
      components: {
        ThreeDButton,
        MannaShowCard,
      },
      computed: {
        sessionInitialized() : boolean {
          return this.store.sessionInitialized;
        }
      },
      watch: {
        sessionInitialized(initialized){
          if (initialized) {
            //DO something
          }
        }
      },
      async mounted() {
        this.currentUser = await getCurrentUserPromise() as User;
        await this.getAndSetManna();
      },
      methods:{
        async getAndSetManna() {
          this.loadingManna = true;
          this.manna = await getTestManna(this.store.locale);
          this.loadingManna = false;
        }
      },
    });
  </script>