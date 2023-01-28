<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="() => $emit('close')">
        <template #footer>
            <div class="w-full flex">
                <div class="grow self-center">See more from
                    <ClickableLink class="inline-block" v-on:link-clicked="$router.push({name: 'category'})">{{article.number}}</ClickableLink>
                    category
                </div> 
                <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8 mx-2" @click="() => {}">
					<ShareIcon class="h-8 opacity-50"/>
				</BaseButton>
                <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8 mx-2" @click="() => {favoriteButton()}">
                    <HeartIconSolid v-if="favorite" class="h-8 error-color-filter pop"/>
					<HeartIcon v-else class="h-8 opacity-50 pop"/>
				</BaseButton>
            </div>
        </template>
        <template #default> 
            <div class="flex max-w-2xl flex-col font-serif">
                <img src="/img/quote.svg" alt="“" class="self-center max-h-10 mt-2"/>
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
import ClickableLink from "./ClickableLink.vue";
import { favorites } from "../services/api";

export default defineComponent({
    name: "wwcard-modal",
    components: {
        BaseModal,
        ShareIcon,
        BaseButton,
        HeartIcon,
        HeartIconSolid,
        ClickableLink
    },
    data: () => ({
        favorite: false,
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
        },
        favoriteButton(){
            this.favorite = !this.favorite;

            if (this.favorite == true){
                favorites.add([this.article.id]);
            } else {
                favorites.delete([this.article.id]);
            }
        },
    },
});
</script>