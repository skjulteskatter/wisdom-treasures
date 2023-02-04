<template>
    <BaseModal class="fixed w-full h-full left-0 top-0 z-40" @close="e => {$emit('close', e)}">
        <template #footer>
            <div class="w-full flex">
                <div class="grow self-center">See more from
                    <ClickableLink class="inline-block" v-on:link-clicked="$router.push({name: 'category'})">{{categoryName}}</ClickableLink>
                    category
                </div> 
                <div>
                    <PopUpMessage class="z-10" :open="openCopyToClipBoardPopUpSemaphore > 0" :text="'Copied to clipboard!'"></PopUpMessage>
                    <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8 mx-2" @click="() => {copyToClipBoard()}">
                        <ClipboardCopyIcon class="h-8 opacity-50 pop" :key="copyToClipBoardKey"/>
                    </BaseButton>
                </div>
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
import { HeartIcon, ClipboardCopyIcon } from "@heroicons/vue/outline";
import BaseButton from "./BaseButton.vue";
import { HeartIcon as HeartIconSolid } from "@heroicons/vue/solid";
import ClickableLink from "./ClickableLink.vue";
import { useSessionStore } from "@/stores/session";
import PopUpMessage from "./PopUpMessage.vue";
import { uuid } from 'vue-uuid';

export default defineComponent({
    name: "wwcard-modal",
    components: {
        BaseModal,
        BaseButton,
        HeartIcon,
        HeartIconSolid,
        ClickableLink,
        ClipboardCopyIcon,
        PopUpMessage
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
        console(){
            return console;
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