<template>
  <main>
    <div class="flex items-center justify-between">
      <BackButton /><!-- should be another color-->
      <h1 class="self-center my-4 sm:my-6 text-base sm:text-xl font-bold tracking-wide">
        Store
      </h1>
      <BackButton class="opacity-0"/>
    </div>

    <AddSwiper class="mt-5 cursor-grab"/>

    <div id="Cards" class="mt-5 w-full px-5 sm:p-0 text-center">
      <StoreCard :loading="loadingCheckoutCard == 'year'" class="bg-primary text-white/90 flex justify-center items-center store-card-width py-3 rounded-none-overwritten" @click="() => { checkout('year') }">
        <template #header>
          <div>
            <div class="text-xl font-bold tracking-wide">Get subscription</div>
          </div>
        </template>
      </StoreCard>
      <p class="text-[color:var(--wt-color-text-grey)] opacity-50">13NOK/month billed annually </p>
    </div>

    <div id="FAQ" class="text-center mx-5 py-8 mt-5  sm:ml-auto sm:mr-auto max-w-2xl">
      <div class="">
        <h3 class="font-bold">How do I get a subscription?</h3>
        <p class="leading-5  text-[color:var(--wt-color-text-grey)] opacity-50">Click on the button above and continue to checkout</p>
      </div>
      <div class="mt-5">
        <h3 class="font-bold">When will my purchase be available?</h3>
        <p class="leading-5  text-[color:var(--wt-color-text-grey)] opacity-50">Your purchase or access should be available as soon as your payment has been processed. 
          This can take several minutes, but in most cases just a few seconds. If you experience any problems, feel free to contact us</p>
      </div>
      <div class="mt-5">
        <h3 class="font-bold">Does my subscription auto renew?</h3>
        <p class="leading-5  text-[color:var(--wt-color-text-grey)] opacity-50">No, you can buy a new subscription when the previous one is outdated</p>
      </div>
    </div>

    <img id="add-bg" class="sm:hidden fixed top-0 left-0 store-card-width -z-50" src="images/add-bg.png"/>
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
<style>
.store-card-width {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}
.rounded-none-overwritten{
  border-radius: 0;
}
</style>