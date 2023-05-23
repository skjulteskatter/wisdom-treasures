<template>
    <main>
      <div class="flex items-center justify-between bg-primary sm:bg-transparent shadow-md sm:shadow-none py-4">
        <BackButton />
        <h1 class="text-base sm:text-3xl font-bold text-white sm:text-inherit tracking-wide">Manna</h1>
        <BackButton class="opacity-0"/>
      </div>
      <Loader :loading="store.mannaHistory.length <= 0">
        <div class="w-full px-5">
          <div id="wordOfTheDayCotainer" class="mt-20 grid sm:grid-cols-3 grid-cols-1 sm:gap-2">
            <MannaShowCard v-if="newestManna != null" :manna="newestManna" :loading="loadingManna === true" class="col-span-2"></MannaShowCard>
            <ThreeDButton size="large" :three-d="true" @clicked="getAndSetManna" :loading="loadingManna !== undefined && loadingManna === true" class="mt-2 sm:mt-0">
              <div class="text-xl">
                <p v-if="loadingManna">Retrieving Manna...</p>
                <p v-else>Get Manna</p>
              </div>
            </ThreeDButton>
          </div>
          <div v-if="mannaHistory.length > 0" id="wrapperDiv" class="my-6 mx-4">
            <p class="text-base sm:text-xl font-bold text-[color:var(--wt-color-text-grey)]">History</p>
            <div class="border-l-2 pl-4 my-3 border-[color:var(--wt-color-secondary-light)]">
              <div class="" v-for="manna in mannaHistory" :key="manna.reference">
                <MannaShowCard v-if="manna != null" :manna="manna" class="my-2"></MannaShowCard>
              </div>
            </div>
          </div>
        </div>
      </Loader>
    </main> 
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useSessionStore } from '@/stores/session';
  import ThreeDButton from '@/components/ThreeDButton.vue';
  import { getManna } from '@/services/mannaService.js';
  import MannaShowCard from '@/components/MannaShowCard.vue';
  import type { Manna } from '@/classes/manna';
  import Loader from '@/components/Loader.vue';
  import BackButton from '@/components/BackButton.vue';
  
    export default defineComponent({
      name: "MannaView",
      data() {
        return {
          store: useSessionStore(),
          loadingManna: false as Boolean
        }
      },
      components: {
        ThreeDButton,
        MannaShowCard,
        Loader,
        BackButton
      },
      computed: {
        sessionInitialized() : boolean {
          return this.store.sessionInitialized;
        },
        newestManna() : Manna | null {
          const mannaHistory = this.store.mannaHistory as Manna[];
          if (mannaHistory.length <= 0) return null;
          return mannaHistory[mannaHistory.length - 1];
        },
        mannaHistory() : Manna[] {
          const mannaHistory = this.store.mannaHistory as Manna[];
          return mannaHistory.slice(0, mannaHistory.length - 1);
        }
      },
      watch: {
        async sessionInitialized(initialized){
          if (initialized) {
            console.log("Manna watch");
            await this.getAndSetManna();
          }
        }
      },
      async mounted() {
        if (this.sessionInitialized && this.store.mannaHistory.length == 0) {
          console.log("Manna mounted");
          await this.getAndSetManna();
        }
      },
      methods:{
        async getAndSetManna() {
          this.loadingManna = true;
          this.store.mannaHistory.push(await getManna(this.store.locale));
          this.loadingManna = false;
        }
      },
    });
  </script>