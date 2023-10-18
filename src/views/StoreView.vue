<template>
  <main>
    <div class="flex items-center py-4">
      <BackButton /><!-- should be another color-->
      <h1 class="absolute left-0 right-0 text-center text-base sm:text-xl font-bold tracking-wide">
        Store
      </h1>
    </div>

    <div class="sm:flex">
      <AddSwiper class="mt-5 cursor-grab sm:w-1/2"/>

      <div class="sm:w-1/2 flex flex-col justify-center">

        <div id="Cards" class="mt-5 sm:mt-10 w-full px-5 sm:p-0 text-center">
          <StoreCard :loading="loadingCheckoutCard == 'month'" class="storeCard storeCardAnimation bg-primary-overwritten text-white/90 flex justify-center items-center store-card-width py-2 sm:py-0.5 rounded-none-overwritten" @click="() => { checkout('month') }">
            <template #header>
              <div>
                <div class="text-xl font-bold tracking-wide">Get subscription</div>
              </div>
            </template>
          </StoreCard>
          <p class="text-[color:var(--wt-color-text-grey)] opacity-50">13NOK/month <!--billed annually--> </p>
        </div>

        <div id="FAQ" class="text-center mx-5 py-8 mt-5 sm:ml-auto sm:mr-auto sm:w-3/4 max-w-2xl">
          <div>
            <h3 class="font-bold">How do I get a subscription?</h3>
            <p class="leading-5 text-[color:var(--wt-color-text-grey)] opacity-50 ml-auto mr-auto">Click on the button above and continue to checkout</p>
          </div>
          <div class="mt-5">
            <h3 class="font-bold">When will my purchase be available?</h3>
            <p class="leading-5 text-[color:var(--wt-color-text-grey)] opacity-50 ml-auto mr-auto">Your purchase or access should be available as soon as your payment has been processed. 
              This can take several minutes, but in most cases just a few seconds. If you experience any problems, feel free to contact us</p>
          </div>
          <div class="mt-5">
            <h3 class="font-bold">Does my subscription auto renew?</h3>
            <p class="leading-5 text-[color:var(--wt-color-text-grey)] opacity-50 ml-auto mr-auto">No, you can buy a new subscription when the previous one is outdated</p>
          </div>
        </div>

      </div>

    </div>

    <img id="add-bg" class="sm:hidden fixed top-0 left-0 store-card-width -z-50" src="../../images/add-bg.png"/>
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
@media (min-width:640px){
  .store-card-width{
    width:75%;
    margin-left:auto;
    margin-right:auto
  }
  .rounded-none-overwritten{
    border-radius: 50rem;
  }
}

.bg-primary-overwritten{
  background-color: var(--wt-color-primary)
}
.bg-primary-overwritten:hover{
  opacity: 0.95
}

.storeCard {
  transform: translate3d(-0px, -4px, 1px);
  transition:
    transform
    600ms
    cubic-bezier(.3, .7, .4, 1);
}
.storeCardAnimation:hover {
  transform: translate3d(-0px, -8px, 1px);
  transition:
    transform
    250ms
    cubic-bezier(.3, .7, .4, 1.5);
}
.storeCardAnimation:active {
  transform: translate3d(-0px, -2px, 1px);
  transition: transform 34ms;
}
</style>