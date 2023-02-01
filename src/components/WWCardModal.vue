<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="() => $emit('close')">
        <template #footer>
            <div class="w-full flex">
                <div class="grow self-center">See more from
                    <ClickableLink class="inline-block" v-on:link-clicked="$router.push({name: 'category'})">{{categoryName}}</ClickableLink>
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
import { Article, Publication } from "hiddentreasures-js";
import { HeartIcon, ShareIcon } from "@heroicons/vue/outline";
import BaseButton from "./BaseButton.vue";
import { HeartIcon as HeartIconSolid } from "@heroicons/vue/solid";
import ClickableLink from "./ClickableLink.vue";
import { useSessionStore } from "@/stores/session";

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
        store: useSessionStore(),
    }),
    emits: ["close"],
    props: {
        article: {
            type: Article,
            required: true,
        },
    },
    computed: {
        favorites(): string[] {
            return this.store.favorites;
        },
        favorite(): boolean{
            return this.store.favorites.includes(this.article.id);
        },
        categoryName(): string{
            return this.store.publications.get(this.article.publicationId)?.title ?? "";
        }
    },
    watch: {
        favorites(newFavs : string[]) {
            this.favorite = newFavs.includes(this.article.id);
        }
    },
    methods: {
        share(){
            console.log("Sharing is not implemented yet");
        },
        favoriteButton(){
            if (!this.favorite){
                console.log("Adding to favorites");
                this.store.addFavorite([this.article.id]);
            } else {
                console.log("Removing from favorites");
                this.store.removeFavorite([this.article.id]);
            }
        },
    },
});
</script>