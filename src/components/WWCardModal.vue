<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="() => $emit('close')">
        <template #footer>
            <div class="w-full flex">
                <div id="justForSpacing" class="grow self-center">See more from this category</div>
                <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8 mx-2" @click="() => {}">
					<ShareIcon class="h-8 opacity-50"/>
				</BaseButton>
                <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8 mx-2" @click="() => {}">
                    <HeartIconSolid class="h-8 heartColor"/>
					<HeartIcon class="h-8 opacity-50 hidden"/>
				</BaseButton>
            </div>
        </template>
        <template #default> 
            <div class="flex max-w-2xl flex-col font-serif">
                <img src="/img/quote.svg" alt="“" class="self-center max-h-10"/>
                <div class="grow m-5" v-html="article.content?.content"/>
            </div>
        </template>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"

import { defineComponent } from "vue";
import { Article } from "hiddentreasures-js";
import { HeartIcon, ShareIcon } from "@heroicons/vue/outline";
import BaseButton from "./BaseButton.vue";
import { HeartIcon as HeartIconSolid } from "@heroicons/vue/solid";

export default defineComponent({
    name: "base-modal",
    components: {
        BaseModal,
        ShareIcon,
        BaseButton,
        HeartIcon,
        HeartIconSolid
    },
    data: () => ({
    }),
    emits: ["close"],
    props: {
        article: {
            type: Article,
            required: true,
        },
    },
    methods: {
        share(){
            console.log("Sharing is not implemented yet");
        }
    },
});
</script>

<style>
.heartColor {
    filter: invert(22%) sepia(83%) saturate(2467%) hue-rotate(345deg) brightness(100%) contrast(94%);
}
</style>