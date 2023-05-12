<template>
  <main>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center justify-between">
      <BackButton />
      <h1 class="my-4 sm:my-6 text-base sm:text-3xl font-bold text-white sm:text-inherit tracking-wide">
        Store
      </h1>
      <BackButton class="opacity-0"/>
    </div>
    

    <div id="Cards" class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-16 h-96">
      <!-- <StoreCard :loading="loadingCheckoutCard == 'month'" class="bg-primary text-white/80" @click="() => { checkout('month') }">
        <template #header>
          <div class="w-full flex justify-center">
            <div>Buy wisdom treasures for one month!</div>
          </div>
        </template>
        <template #default>
          <div>Here are som of the reasons blah blah blah</div>
        </template>
      </StoreCard> -->
      <h1 class="sm:hidden text-2xl font-bold tracking-wide">Buy subscribtion for WisdomTreasures for one year!</h1>
      <StoreCard :loading="loadingCheckoutCard == 'year'" class="bg-primary text-white/90 justify-end" @click="() => { checkout('year') }">
        <template #header>
          <div>
            <div class="font-bold tracking-wide sm:pl-8">Get subscription</div>
          </div>
        </template>
        <template #default>
          <div class="text-base tracking-wide sm:pl-8 sm:pb-8 text-white/80">for 156NOK/year</div>
        </template>
      </StoreCard>
      <div>
        <h1 class="hidden sm:block text-3xl font-bold tracking-wide">Buy subscribtion for WisdomTreasures for one year!</h1>
        <p class="text-xl sm:mt-12 sm:mb-4 ">Get access to:</p>
        <ul class="text-base list-disc list-inside">
          <li>first reason to buy subscribtion</li>
          <li>second reason to buy subscribtion</li>
          <li>third reason to buy subscribtion</li>
          <li>fourth reason to buy subscribtion</li>
        </ul>
      </div>
    </div>
  </main> 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSessionStore } from '@/stores/session';
import BaseCard from '@/components/BaseCard.vue';
import StoreCard from '@/components/StoreCard.vue';
import BackButton from '@/components/BackButton.vue';

  export default defineComponent({
    name: "FavoriteView",
    data() {
      return {
        store: useSessionStore(),
        loadingCheckoutCard: "" as string,
      }
    },
    components: {
      BaseCard,
      StoreCard,
      BackButton,
    },
    computed: {
      wwProducts() : string[]{
        return this.store.apiProducts.map(x => x.id);
      },
    },
    methods: {
      checkout( type: "month" | "year" ){
        this.loadingCheckoutCard = type;
        console.log(type);
        this.store.stripeService?.checkout([this.wwProducts[0]], type);
      },
    }
  });
</script>