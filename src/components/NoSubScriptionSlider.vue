<template>
    <swiper :modules="modules" :pagination="pagination" :autoplay="autoplay" class="">
        <swiper-slide class="flex justify-center items-center">
            <div class="max-h-70%">
                <img src="\img\NoSub\NoSub_TodaysWord.svg" alt="Today's Word" class="h-auto mb-2" />
            </div>
            <hr class="my-1" />
            <h2 class="mb-5 mt-2 leading-4 font-bold text-center text-xl">
                Get Daily Word of Wisdom
            </h2>
            <h3 class="text-[color:var(--wt-color-text-grey)] text-center">
                Get "Todays word of wisdom" every day in the WisdomTreasures app</h3>
        </swiper-slide>
        <swiper-slide class="flex mx-auto items-center justify-center">
            <div>
                <img src="\img\NoSub\NoSub_Events.svg" height="450" />
            </div>
            <hr class="my-1" />
            <h2 class="mb-5 mt-2 leading-4 font-bold  text-center text-xl">
                Catch up on latest events
            </h2>
            <h3 class="text-[color:var(--wt-color-text-grey)] text-center">
                Wisdom Treasures is continuously updated with wisdom words from recent events globally!</h3>
        </swiper-slide>
        <swiper-slide class="flex mx-auto items-center justify-center">
            <div>
                <img src="\img\NoSub\NoSub_Manna.svg" height="450" />
            </div>
            <hr class="my-1" />
            <h2 class="mb-5 mt-2 leading-4 font-bold  text-center text-xl">
                Draw wisdom manna
            </h2>
            <h3 class="text-[color:var(--wt-color-text-grey)] text-center">
                Wisdom treasures lets you draw wisdom words from our large collection of over 8000 wisdom words!
            </h3>
        </swiper-slide>
        <swiper-slide class="flex mx-auto items-center justify-center">
            <div>
                <img src="\img\NoSub\NoSub_Favorites.svg" height="450" />
            </div>
            <hr class="my-1" />
            <h2 class="mb-5 mt-2 leading-4 font-bold  text-center text-xl">
                Favorites
            </h2>
            <h3 class="text-[color:var(--wt-color-text-grey)] text-center">
                Save and collect your favourite wisdom words! </h3>
        </swiper-slide>
        <swiper-slide class="flex mx-auto items-center justify-center">
            <div>
                <img src="\img\NoSub\NoSub_Themes.svg" height="450" />
            </div>
            <hr class="my-1" />
            <h2 class="mb-5 mt-2 leading-4 font-bold  text-center text-xl">
                Browse themes
            </h2>
            <h3 class="text-[color:var(--wt-color-text-grey)] text-center">
                Browse through our library of more than 250 themes of wisdoms words! </h3>
        </swiper-slide>
    </swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import SwiperCore, { Pagination, Autoplay } from 'swiper/core';

SwiperCore.use([Pagination, Autoplay]);

export default {
    name: 'NoSubscriptionSviper',
    components: {
        Swiper,
        SwiperSlide   // Make sure to use this in your template, otherwise remove this line.
    },
    data() {
        return {
            modules: [Pagination, Autoplay],
            pagination: { clickable: true },
            autoplay: { delay: 5000 }
        };
    },
};
</script>