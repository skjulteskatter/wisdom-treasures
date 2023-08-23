<template>
  <swiper
  
    :slidesPerView="'auto'"
    :spaceBetween="25"
    :mousewheel="{
      forceToAxis: true
    }"
    :pagination="{
      clickable: true,
    }"
    :modules="modules"
    class="originSwiper "
  >
  
  <swiper-slide v-for="origin in origins" :key="origin.id" class="max-w-min mb-8 flex items-center justify-center pt-5 px-5">
    <Origin :origin="origin"/>
  </swiper-slide>

  <swiper-slide class="max-w-min pt-5  mb-8">
    <div class="w-24 h-24 flex justify-center items-center rounded-xl shadow-md bg-primary/60"></div>
     <h2 class="mb-5 mt-2 leading-4 font-bold text-sm text-[color:var(--wt-color-text-grey)] opacity-80 tracking-075">
      {{ $t('common.origin')}}
        </h2>
  </swiper-slide>
  <swiper-slide class="max-w-min pt-5  mb-8">
    <div class="w-24 h-24 flex justify-center items-center rounded-xl shadow-sm bg-primary/40"></div>
    <h2 class="mb-5 mt-2 leading-4 font-bold text-sm text-[color:var(--wt-color-text-grey)] opacity-80 tracking-075">
      {{ $t('common.origin')}}
        </h2>
  </swiper-slide>
  <swiper-slide class="max-w-min pt-5 mb-8">
    <div class="w-24 h-24 flex justify-center items-center rounded-xl bg-primary/20"></div>
    <h2 class="mb-5 mt-2 leading-4 font-bold text-sm text-[color:var(--wt-color-text-grey)] opacity-80 tracking-075">
      {{ $t('common.origin')}}
        </h2>
  </swiper-slide>
  <swiper-slide class="max-w-min justify-center pt-5 mb-8">
    <div class="w-24 h-24 flex justify-center items-center rounded-xl bg-primary/10"></div>
    <h2 class="mb-5 mt-2 leading-4 font-bold text-sm text-[color:var(--wt-color-text-grey)] opacity-80 tracking-075">
      {{ $t('common.origin')}}
        </h2>
  </swiper-slide>
 

  </swiper>
</template>
  <script lang="ts">
   // Import Swiper Vue.js components
   import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

import 'swiper/css/pagination';

// import required modules
import { Mousewheel, Pagination } from 'swiper';
import Origin from './Origin.vue';
import { useSessionStore } from '@/stores/session';
import type { Origin as OriginDto } from '@/classes/Origin';

export default {
  name: "OriginsSwiper",
  data() {
    return {
      store: useSessionStore(),
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    Origin
  },
  computed:{
    origins(): OriginDto[] {
      return Array.from(this.store.origins.values());
    }
  },
  setup() {
    return {
      modules: [Pagination, Mousewheel],
    };
  },
};
  </script>
  
<style>
.swiper-pagination-bullet-active {
     background-color: var(--wt-color-primary) !important;
}
</style>@/classes/Origin