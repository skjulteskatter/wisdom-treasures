<template>
  <main>
    <div class="flex items-center justify-between">
      <BackButton /><!-- should be another color-->
      <h1 class="my-4 sm:my-6 text-base sm:text-3xl font-bold tracking-wide">
        Store
      </h1>
      <BackButton class="opacity-0"/>
    </div>
    
    <AddSwiper class="my-10"/>
    

    <div id="Cards" class="fixed bottom-20 left-0 w-full px-5">
      <StoreCard :loading="loadingCheckoutCard == 'year'" class="w-full bg-primary text-white/90 flex justify-center items-center" @click="() => { checkout('year') }">
        <template #header>
          <div>
            <div class=" md:text-2xl font-bold tracking-wide">Get subscription</div>
          </div>
        </template>
      </StoreCard>
    </div>
  </main> 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSessionStore } from '@/stores/session';
import StoreCard from '@/components/StoreCard.vue';
import BackButton from '@/components/BackButton.vue';
import AddSwiper from '@/components/AddSwiper.vue';

  export default defineComponent({
    name: "FavoriteView",
    data() {
      return {
        store: useSessionStore(),
        loadingCheckoutCard: "" as string,
      }
    },
    components: {
      StoreCard,
      BackButton,
      AddSwiper
    },
    computed: {
      wwProducts() : string[]{
        return this.store.apiProducts.filter(x => x.collectionIds.includes("aa7d92e3-c92f-41f8-87a1-333375125a1c" /*Maybe not hardcode collection ID 🤷‍♂️*/)).map(x => x.id);
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