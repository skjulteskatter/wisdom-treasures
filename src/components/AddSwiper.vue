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
    >
      <swiper-slide class="mb-8"><div class="flex justify-center items-center"><img src="/images/app-feat-1.png" class="h-96"></div></swiper-slide>
      <swiper-slide class="mb-8"><div class="flex justify-center items-center"><img src="/images/app-feat-1.png" class="h-96"></div></swiper-slide>
      <swiper-slide class="mb-8"><div class="flex justify-center items-center"><img src="/images/app-feat-1.png" class="h-96"></div></swiper-slide>
  
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
  
  export default {
    components: {
      Swiper,
      SwiperSlide,
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