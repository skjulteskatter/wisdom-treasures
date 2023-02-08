<template>
    <BaseModal class="fixed w-full h-full left-0 top-0 z-40" @close="e => {$emit('close', e)}" :useBaseCard="false">
        <WWShowCard :article="article"></WWShowCard>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"

import { defineComponent } from "vue";
import { Article } from "hiddentreasures-js";
import { useSessionStore } from "@/stores/session";
import { uuid } from 'vue-uuid';
import WWShowCard from "./WWShowCard.vue";

export default defineComponent({
    name: "wwcard-modal",
    components: {
        BaseModal,
        WWShowCard,
    },
    data: () => ({
        store: useSessionStore(),
        copyToClipBoardKey: uuid.v4() as string,
        openCopyToClipBoardPopUpSemaphore: 0 as number,
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
        },
    },
    watch: {
        favorites(newFavs : string[]) {
            this.favorite = newFavs.includes(this.article.id);
        }
    },
    methods: {
        favoriteButton(){
            if (!this.favorite){
                console.log("Adding to favorites");
                this.store.addFavorite([this.article.id]);
            } else {
                console.log("Removing from favorites");
                this.store.removeFavorite([this.article.id]);
            }
        },
        copyToClipBoard() {
            this.copyToClipBoardKey = uuid.v4();
            if (!this.article.content?.content) return;
            navigator.clipboard.writeText(this.article.content?.content.replace(/<.+?>/g, "").trim());

            this.openCopyToClipBoardPopUpSemaphore++;
            setTimeout(() => {
                this.openCopyToClipBoardPopUpSemaphore--;
            }, 2000);
        }
    },
});
</script>