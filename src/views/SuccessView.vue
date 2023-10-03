<template>
  <main>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center py-4">
      <BackButton />
      <h1 class="absolute left-0 right-0 text-center text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">
        Success!
      </h1>
    </div>

    <img id="check-mark" class="w-3/5 max-w-sm mt-16 sm:mt-5 mr-auto ml-auto" src="../../images/success-mark.png"/>
    
    <div class="flex flex-col w-fit mr-auto ml-auto px-10 text-center">
      <div>
        <h2 class="mt-5 text-2xl sm:text-3xl font-bold">Thank you!</h2>
        <h3 class="mt-5 text-xl sm:text-2xl mb-5 font-semibold">You have just subscribed to WisdomTreasures</h3>
      </div>
      <p class="opacity-70">To manage subscriptions, go to: <a>{{ stripeManageLink }}</a></p>
    </div>

    <img id="add-bg" class="sm:hidden fixed bottom-32 left-0 w-screen -z-50 opacity-60" src="../../images/add-bg.png"/>
  </main> 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSessionStore } from '@/stores/session';
import BackButton from '@/components/BackButton.vue';
import { STRIPE_MANAGE_LINK } from '@/stores/session';

  export default defineComponent({
    name: "SuccessView",
    data() {
      return {
        store: useSessionStore(),
        loadingCheckoutCard: "" as string,
      }
    },
    components: {
      BackButton,
    },
    computed: {
      stripeManageLink(): string{
        return STRIPE_MANAGE_LINK;
      }
    },
    methods: {

    },
    mounted(){
      this.store.reset(); //Find a better way for this
    }
  });
</script>
<style scoped>
</style>