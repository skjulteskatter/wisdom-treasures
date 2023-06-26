<template>
  <main>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center justify-between">
      <BackButton />
      <h1 class="my-4 sm:my-6 text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">
        Success!
      </h1>
      <BackButton class="opacity-0"/>
    </div>
    
    <div class="flex">
      <div class="flex-grow" />
      <div class="w-96">
        You just sucessfully subscribed to WisdomTreasures!
        <br/>
        <br/>
        To unsubscribe, go to: some link.
        <br/>
        <br/>
        You will be redirected to the homepage in 10 seconds...
      </div>
      <div class="flex-grow" />
    </div>
  </main> 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSessionStore } from '@/stores/session';
import BaseCard from '@/components/BaseCard.vue';
import BackButton from '@/components/BackButton.vue';

  export default defineComponent({
    name: "SuccessView",
    data() {
      return {
        store: useSessionStore(),
        loadingCheckoutCard: "" as string,
      }
    },
    components: {
      BaseCard,
      BackButton,
    },
    computed: {

    },
    methods: {

    }
  });
</script>
<style scoped>
</style>