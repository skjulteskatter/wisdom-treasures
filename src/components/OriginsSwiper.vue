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
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>
    <swiper-slide class="max-w-min mb-8"><Origin/></swiper-slide>

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

export default {
  components: {
    Swiper,
    SwiperSlide,
    Origin
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
</style>