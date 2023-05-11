<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      Store
    </h1>
    <p>Buy just for one month, or a whole year!</p>
    <div id="Cards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
      <StoreCard :loading="loadingCheckoutCard == 'month'" class="bg-primary text-white/80" @click="() => { checkout('month') }">
        <template #header>
          <div class="w-full flex justify-center">
            <div>Buy wisdom treasures for one month!</div>
          </div>
        </template>
        <template #default>
          <div>Here are som of the reasons blah blah blah</div>
        </template>
      </StoreCard>
      <StoreCard :loading="loadingCheckoutCard == 'year'" @click="() => { checkout('year') }">
        <template #header>
          <div class="w-full flex justify-center">
            <div>Buy wisdom treasures for one year!</div>
          </div>
        </template>
        <template #default>
          <div>Here are som of the reasons blah blah blah</div>
        </template>
      </StoreCard>
    </div>
  </main> 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSessionStore } from '@/stores/session';
import BaseCard from '@/components/BaseCard.vue';
import StoreCard from '@/components/StoreCard.vue';

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
      StoreCard
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