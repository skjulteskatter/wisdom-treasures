<template>
  <main class="">
    <div>
      <img
        id="background-img"
        src="../../images/backgroundlogo.svg"
        class="hidden sm:block fixed -top-10 -right-44 2xl:-right-5 w-custom-45rem -z-20 transition-all duration-300 ease-in-out blur-sm"
      />
      <div
        class="flex py-10 bg-[color:var(--wt-c-white-soft)] sm:bg-transparent items-center shadow-md sm:shadow-none z-40 max-h-10 sm:h-auto w-full top-0 left-0 sm:static px-6 sm:px-0"
      >
        <h1
          class="text-base font-bold text-[color:var(--wt-color-text-grey)] opacity-80"
        >
          <span v-if="currentUser" class="sm:font-bold text-lg tracking-075">
            {{ $t("common.welcome") }},

            <span
              class="animated-gradient font-bold cursor-pointer"
              @click="$router.push({ name: 'profile' })"
            >
              {{ currentUser.displayName }}
            </span>
          </span>
          <span v-else class="sm:font-bold text-lg tracking-075">
            {{ $t("home.welcometo") }}
            <span class="animated-gradient font-bold"> WisdomTreasures </span>
          </span>
        </h1>
      </div>

      <div
        class="lg:flex items-center justify-center pt-10 md:pt-0"
        id="showcase"
      >
        <div class="md:w-1/2 mx-5 space-y-5 md:-translate-y-20 md:pb-40">
          <h1
            class="sm:text-3xl font-bold text-3xl sm:text-inherit tracking-wide"
          >
            {{ $t("nosub.title") }}
          </h1>
          <p>
            {{ $t("nosub.subtitle") }}
          </p>
          <BaseButton
          :loading="loadingCheckoutCard == 'month'"
            class="rounded-full"
            @click="() => { checkout('month')}"
            theme="primary"
          >
            {{ $t("nosub.buy") }}
          </BaseButton>
          <p class="text-[color:var(--wt-color-text-grey)] opacity-50">
            13NOK/month
            <!--billed annually-->
          </p>
          <div id="FAQ" class="text-center mx-5 py-8 mt-5 sm:ml-auto sm:mr-auto sm:w-3/4 max-w-2xl">
          <div>
            <h3 class="font-bold">{{ $t('store.q1') }}</h3>
            <p class="leading-5 text-[color:var(--wt-color-text-grey)] opacity-50 ml-auto mr-auto">{{ $t('store.q1a') }}</p>
          </div>
          <div class="mt-5">
            <h3 class="font-bold">{{ $t('store.q2') }}</h3>
            <p class="leading-5 text-[color:var(--wt-color-text-grey)] opacity-50 ml-auto mr-auto">{{ $t('store.q2a') }}</p>
          </div>
          <div class="mt-5">
            <h3 class="font-bold">{{ $t('store.q3') }}</h3>
            <p class="leading-5 text-[color:var(--wt-color-text-grey)] opacity-50 ml-auto mr-auto">{{ $t('store.q3a') }}</p>
          </div>
        </div>
        </div>

        <div class="h-screen md:w-1/2 px-5">
          <NoSubscriptionSlider class="h-2/3" />
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import type { User } from "@firebase/auth";
import { defineComponent } from "vue";
import { useSessionStore } from "@/stores/session";
import BaseButton from "@/components/BaseButton.vue";
import NoSubscriptionSlider from "@/components/NoSubScriptionSlider.vue";
import { WISDOM_WORDS_ID } from '@/stores/session'
import { log } from '@/services/env';

export default defineComponent({
  name: "StoreView",
  data() {
    return {
      store: useSessionStore(),
      loadingCheckoutCard: "" as string,
      currentUser: null as User | null,
    };
  },
  components: {
    BaseButton,
    NoSubscriptionSlider,
  },
  computed: {
    wwProducts() : string[]{
      return this.store.apiProducts.filter(x => x.collectionIds.includes(WISDOM_WORDS_ID)).map(x => x.id);
    }
  },
  methods: {
    checkout( type: "month" | "year" ){
        this.loadingCheckoutCard = type;
        log && console.log(type);
        this.store.stripeService?.checkout([this.wwProducts[0]], type);
      }
  },
});
</script>
<style scoped>
.tracking-075 {
  letter-spacing: 0.075em;
}

.rounded-t-4xl {
  border-top-left-radius: 2.5rem;
  /* 40px */
  border-top-right-radius: 2.5rem;
  /* 40px */
}

.h-custom {
  height: max(28rem, 64vh);
}

.highlighted {
  font-size: 1.15rem;
  color: var(--wt-color-primary);
  opacity: 0.9;
  scale: 1.3;
}

@media (min-width: 640px) {
  .h-custom {
    height: auto;
  }

  .h-custom.fav-his {
    height: 18rem;
  }
}
</style>
