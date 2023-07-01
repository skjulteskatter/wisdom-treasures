<template>
    <swiper
      :slidesPerView="'auto'"
      :spaceBetween="25"
      :autoplay="{
        delay: 3500,

      }"
      :mousewheel="{
        forceToAxis: true
      }"
      :pagination="{
        clickable: true,
      }"
      :modules="modules"
    >
        <swiper-slide class="mb-12">
            <div class="flex flex-col justify-center items-center text-center">
                <img src="/images/add-1.png" class="h-96 object-contain">
                <h3 class="font-bold text-xl tracking-wide mt-5">Get daily wisdom words</h3>
                <p class="leading-5 mx-5 text-[color:var(--wt-color-text-grey)] opacity-50">Every day get a chosen wisdom word as your daily wisdom word</p>
            </div>
        </swiper-slide>
        <swiper-slide class="mb-12">
            <div class="flex flex-col justify-center items-center text-center w-full">
                <img src="/images/add-2.png" class="h-96 object-contain">
                <h3 class="font-bold text-xl tracking-wide mt-5">Catch up on latest events</h3>
                <p class="leading-5 mx-5 text-[color:var(--wt-color-text-grey)] opacity-50">Wisdom Treasures is continuously updated with wisdom words from the last BCC events</p>
            </div>
        </swiper-slide>
        <swiper-slide class="mb-12">
            <div class="flex flex-col justify-center items-center text-center">
                <img src="/images/add-3.png" class="h-96 object-contain">
                <h3 class="font-bold text-xl tracking-wide mt-5">Favorites</h3>
                <p class="leading-5 mx-5 text-[color:var(--wt-color-text-grey)] opacity-50">Save and collect your favorites wisdom words</p>
            </div>
        </swiper-slide>
        <swiper-slide class="mb-12">
            <div class="flex flex-col justify-center items-center text-center">
                <img src="/images/add-4.png" class="h-96 object-contain">
                <h3 class="font-bold text-xl tracking-wide mt-5">And more!</h3>
                <p class="leading-5 mx-5 text-[color:var(--wt-color-text-grey)] opacity-50">Browse themes, find wisdom words, listen to audio files</p>
            </div>
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
  import { Autoplay, Mousewheel, Pagination } from 'swiper';
  
  export default {
    components: {
      Swiper,
      SwiperSlide,
    },
    setup() {
      return {
        modules: [Pagination, Mousewheel, Autoplay],
      };
    },
  };
    </script>
    
  <style>
  .swiper-pagination-bullet-active {
       background-color: var(--wt-color-primary) !important;
  }
  </style>