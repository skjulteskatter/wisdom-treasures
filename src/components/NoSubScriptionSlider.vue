<style scoped>
.swiper-wrapper .swiper-slide {
  height: unset;
}
</style>
<template>
  <swiper
    :spaceBetween="30"
    :effect="'fade'"
    :autoplay="autoplay"
    :navigation="true"
    :pagination="{
      clickable: true,
    }"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide v-for="slide in slides" :key="slide.title" class="py-11 px-2">
      <div class="h-5/6 pt-10 flex flex-col items-center">
        <img :src="slide.image" class="h-full w-auto object-cover" />
      </div>
      <h2 class="mb-2 font-bold text-center text-xl">
        {{ slide.title }}
      </h2>
      <h3 class="text-center mb-10">
        {{ slide.description }}
      </h3>
    </swiper-slide>
  </swiper>
</template>
<script lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper";

export default {
  name: "NoSubscriptionSlider",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modules: [Pagination, Autoplay],
      pagination: { clickable: true },
      autoplay: { delay: 5000 },
      slides: [
        {
          title: this.$t("nosub.todaysword.title"),
          description: this.$t("nosub.todaysword.description"),
          image: "/img/NoSub/NoSub_TodaysWord.jpg",
        },
        {
          title: this.$t("nosub.favorites.title"),
          description: this.$t("nosub.favorites.description"),
          image: "/img/NoSub/NoSub_Favorites.jpg",
        },
        {
          title: this.$t("nosub.manna.title"),
          description: this.$t("nosub.manna.description"),
          image: "/img/NoSub/NoSub_Manna.jpg",
        },
        {
          title: this.$t("nosub.events.title"),
          description: this.$t("nosub.events.description"),
          image: "/img/NoSub/NoSub_Events.jpg",
        },
        {
          title: this.$t("nosub.themes.title"),
          description: this.$t("nosub.themes.description"),
          image: "/img/NoSub/NoSub_Themes.png",
        },
      ],
    };
  },
};
</script>
