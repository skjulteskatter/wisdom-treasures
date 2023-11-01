<template>
    <BaseModal class="fixed w-full h-full left-0 top-0 z-40" @close="(e: any) => {$emit('close', e)}" :useBaseCard="false">
        <WWShowCard :article="currentArticle"/>
        <div v-if="mannaArticleIdList.length > 0" class="w-full h-16 flex items-end justify-center">
            <BaseButton theme="threeDBtn" @click="changeManna()">
                {{ $t('common.getNewManna') }}
                <template #icon>
                    <RefreshIcon class="h-5"></RefreshIcon>
                </template>
            </BaseButton>
        </div>

    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"

import { defineComponent, type PropType } from "vue";
import type { Article } from "hiddentreasures-js";
import { useSessionStore } from "@/stores/session";
import { uuid } from 'vue-uuid';
import WWShowCard from "./WWShowCard.vue";
import BaseButton from "./BaseButton.vue";
import { RefreshIcon } from "@heroicons/vue/outline";
import { history } from "@/services/localStorage";
import { log } from '@/services/env'

export default defineComponent({
    name: "wwcard-modal",
    components: {
        BaseModal,
        WWShowCard,
        BaseButton,
        RefreshIcon
    },
    data: () => ({
        store: useSessionStore(),
        copyToClipBoardKey: uuid.v4(),
        openCopyToClipBoardPopUpSemaphore: 0 as number,
        currentArticle: {} as Article,
        index: 1 as number, // Set to 1 because the initial article is set to 0
    }),
    emits: ["close"],
    props: {
        article: {
            type: Object as PropType<Article>,
            required: true,
        },
        mannaArticleIdList: {
            type: Array as PropType<Array<string>>,
            required: false,
            default: [] as Array<string>
        },
    },
    mounted(){
        this.currentArticle = this.article;
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
                log && console.log("Adding to favorites");
                this.store.addFavorite([this.article.id]);
            } else {
                log && console.log("Removing from favorites");
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
        },
        //changeManna(){
        //    
        //    //Return if there's only similar id's in mannaArticleIdList
        //    if (this.mannaArticleIdList.filter(x => this.currentArticle.id != x).length <= 0) return;
        //    let newId = this.currentArticle.id;
        //    while (newId == this.currentArticle.id){
        //        newId = this.mannaArticleIdList[Math.floor(Math.random() * this.mannaArticleIdList.length)];
        //    }
        //    let newArticle = this.store.articles.get(newId);
        //    if (newArticle !== undefined){
        //        this.currentArticle = newArticle;
        //        history.addOrReplace(newId, Date.now());
        //    }
        //}
        changeManna(){
            if (this.index >= this.mannaArticleIdList.length) this.index = 0;
            let newId = this.mannaArticleIdList[this.index];
            let newArticle = this.store.articles.get(newId);
            if (newArticle === undefined) return;
            this.currentArticle = newArticle;
            this.index++;
            history.addOrReplace(newId, Date.now());
        }
    },
    
});
</script>