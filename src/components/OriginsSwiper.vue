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
    class="originSwiper"
  >
  
  <swiper-slide v-for="origin in origins" :key="origin.id" class="max-w-min mb-8">
    <Origin :origin="origin"/>
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
  name: "WWShowCard",
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