<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="closeWithReturnArrays">
        <div id="authors" class="h-60 overflow-y-scroll">
            <div v-for="(author, index) in allAuthors" :key="index" class="flex">
                <label class="flex gap-2 ml-2 mt-2 items-center cursor-pointer select-none">
                    <BaseCheckbox v-model="authorCheckBoxArray[index]" @vnode-mounted="()=>{if (!initialAuthorIds.includes(author.id)){authorCheckBoxArray[index] = false}}"/>
                    {{ author.name }}
                </label>
            </div>
        </div>
        <div id="publications" class="h-60 overflow-y-scroll">
            <div v-for="(publication, index) in allPublications" :key="index" class="flex">
                <label class="flex gap-2 ml-2 mt-2 items-center cursor-pointer select-none">
                    <BaseCheckbox v-model="publicationCheckBoxArray[index]" @vnode-mounted="()=>{if (!initialPublicationIds.includes(publication.id)){publicationCheckBoxArray[index] = false}}"/>
                    {{ publication.title }}
                </label>
            </div>
        </div>
        <div id="publications" class="">
            <label class="flex gap-2 ml-2 mt-2 items-center cursor-pointer select-none">
                <BaseCheckbox v-model="onlyFavorites" @vnode-mounted="()=>{onlyFavorites = initialOnlyFavorites}"/>
                Favorite
            </label>
        </div>
        <BaseButton @click="closeWithReturnArrays" class="w-full mt-2">
            Search
            <template #icon>
              <SearchIcon class="h-5"></SearchIcon>
            </template>
        </BaseButton>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"
import BaseCheckbox from "./BaseCheckbox.vue";
import { defineComponent } from "vue";
import type { Contributor, Publication } from "hiddentreasures-js";
import { useSessionStore } from "@/stores/session";
import BaseButton from "./BaseButton.vue";
import { SearchIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "filter-modal",
    components: {
    BaseModal,
    BaseCheckbox,
    BaseButton,
    SearchIcon
},
    data: () => ({
        store: useSessionStore(),
        publicationCheckBoxArray: [] as boolean[],
        authorCheckBoxArray: [] as boolean[],
        onlyFavorites: false as boolean,
    }),
    emits: ["close:withSearch", "publicationIdArray:publicationIdArray", "contributorIdArray:contributorIdArray", "onlyFavorites:onlyFavorites"],
    props: {
        initialPublicationIds: {
            type: Array<String>,
            default: [],
        },
        initialAuthorIds: {
            type: Array<String>,
            default: [],
        },
        initialOnlyFavorites: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        allPublications() : Publication[]{
            return Array.from(this.store.publications.values()).sort((a: Publication, b: Publication) => a.title.localeCompare(b.title, this.store.locale));
        },
        allAuthors() : Contributor[]{
            return Array.from(this.store.authors.values()).sort((a: Contributor, b: Contributor) => a.name.localeCompare(b.name, this.store.locale));
        }
    },
    watch: {
        allPublications(newValue: Publication[]){
            while (this.publicationCheckBoxArray.length < newValue.length){
                this.publicationCheckBoxArray.push(false);
            }
        },
        allAuthors(newValue: Contributor[]){
            while (this.authorCheckBoxArray.length < newValue.length){
                this.authorCheckBoxArray.push(false);
            }
        }
    },
    methods: {
        closeWithReturnArrays() {

            let withSearchOnClose : boolean = false;

            const publicationsArray : string[] = [];
            for (let i = 0; i < this.allPublications.length; i++) {
                if (this.publicationCheckBoxArray[i])
                    publicationsArray.push(this.allPublications[i].id);
            }

            const authorsArray : string[] = [];
            for (let i = 0; i < this.allPublications.length; i++) {
                if (this.authorCheckBoxArray[i])
                    authorsArray.push(this.allAuthors[i].id);
            }

            withSearchOnClose = withSearchOnClose || 
                publicationsArray.toString() !== this.initialPublicationIds.toString() ||
                authorsArray.toString() !== this.initialAuthorIds.toString() || 
                this.onlyFavorites !== this.initialOnlyFavorites;

            this.$emit('publicationIdArray:publicationIdArray', publicationsArray);

            this.$emit('contributorIdArray:contributorIdArray', authorsArray);

            this.$emit('onlyFavorites:onlyFavorites', this.onlyFavorites);

            this.$emit('close:withSearch', withSearchOnClose);
        },
    }
});
</script>

<style>
</style>