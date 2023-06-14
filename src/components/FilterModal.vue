<template>
    <transition
		enter-active-class="transition duration-100 ease-out"
		enter-from-class="transform scale-95 opacity-0"
		enter-to-class="transform scale-100 opacity-100"
		leave-active-class="transition duration-75 ease-in"
		leave-from-class="transform scale-100 opacity-100"
		leave-to-class="transform scale-95 opacity-0"
		>
        <div :show="true" v-if="show" @close="closeWithReturnArrays">
                <div class="grid grid-cols-3 gap-2 mt-4 items-center">
                    <div id="authors">
                        <button @click="showAuthors = !showAuthors, showPublications = false" class="box-border w-full border-2 rounded-sm py-1.5 border-white/80 sm:border-primary text-white/80 sm:text-primary text-xs" :class="showAuthors ? 'border-b-none' : ''">Author</button>
                        <transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0"
                            >
                            <div v-if="showAuthors" id="authors" class="w-half-screen absolute top-7 left-0 bg-primary bg-[color:var(--wt-c-white-soft)] shadow-lg border-2 rounded-sm border-white-80 max-h-50-percent overflow-y-scroll z-50" :class="{'hidden' : hideAuthors}">
                                <div v-for="(author, index) in allAuthors" :key="index" class="flex">
                                    <label class="w-full flex gap-2 mx-2 my-2 items-center cursor-pointer select-none">
                                        <BaseCheckbox v-model="authorCheckBoxArray[index]" @vnode-mounted="setInitialAuthorValue(author.id, index)"/>
                                        <p :class="{'font-bold' : authorCheckBoxArray[index] }" class="max-w-80-percent truncate text-white/80 sm:text-inherit text-xs">{{ author.name }}</p>
                                    </label>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <div id="publications">
                        <button @click="showPublications = !showPublications, showAuthors = false" class="w-full border-2 rounded-sm border-white/80 sm:border-primary py-1.5 text-white/80 sm:text-primary text-xs">Publication</button>
                        <transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0"
                            >
                            <div v-if="showPublications" id="publications" class="w-half-screen absolute top-7 left-0 bg-primary sm:bg-[color:var(--wt-c-white-soft)] shadow-lg border-2 rounded-sm border-white/80 max-h-50-percent overflow-y-scroll z-50" :class="{'hidden' : hidePublications}">
                                <div v-for="(publication, index) in allPublications" :key="index" class="flex z-50">
                                    <label class="w-full flex gap-2 ml-2 my-2 items-center cursor-pointer select-none">
                                        <BaseCheckbox v-model="publicationCheckBoxArray[index]" @vnode-mounted="setInitialPublicationValue(publication.id, index)"/>
                                        <p :class="{'font-bold' : publicationCheckBoxArray[index] }" class="max-w-80-percent truncate text-white/80 sm:text-inherit text-xs">{{ publication.title }}</p>
                                    </label>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <div id="favorites" @click="showPublications = false, showAuthors = false" class="z-30 border-box flex justify-center items-center rounded-sm transition cursor-pointer">
                        <label class="w-full h-full flex justify-center items-center">
                            <BaseCheckbox class="w-full h-full absolute opacity-0 cursor-pointer " v-model="onlyFavorites" @vnode-mounted="()=>{onlyFavorites = initialOnlyFavorites}" @click="closeWithReturnArrays"/>
                            <p :class="{'bg-white/20 sm:bg-primary sm:text-white' : onlyFavorites }" class="w-full h-full text-center border-2 border-white/80 py-1.5 sm:border-primary text-white/80 sm:text-primary text-xs cursor-pointer">Favorites</p>
                        </label>
                    </div>
                </div>
                <!-- <BaseButton @click="closeWithReturnArrays" class="border w-full mt-2 z-30">
                    Search
                    <template #icon>
                    <SearchIcon class="h-5"></SearchIcon>
                    </template>
                </BaseButton> -->
                <div v-if="showPublications || showAuthors" id="clickOutsideDetector" class="bg-transparent fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40" @click="closeWithReturnArrays"/>
        </div>
    </transition>

    <!-- <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="closeWithReturnArrays">
        <div id="authors" class="h-60 overflow-y-scroll" :class="{'hidden' : hideAuthors}">
            <div v-for="(author, index) in allAuthors" :key="index" class="flex">
                <label class="flex gap-2 ml-2 mt-2 items-center cursor-pointer select-none">
                    <BaseCheckbox v-model="authorCheckBoxArray[index]" @vnode-mounted="setInitialAuthorValue(author.id, index)"/>
                    {{ author.name }}
                </label>
            </div>
        </div>
        <div id="publications" class="h-60 overflow-y-scroll" :class="{'hidden' : hidePublications}">
            <div v-for="(publication, index) in allPublications" :key="index" class="flex">
                <label class="flex gap-2 ml-2 mt-2 items-center cursor-pointer select-none">
                    <BaseCheckbox v-model="publicationCheckBoxArray[index]" @vnode-mounted="setInitialPublicationValue(publication.id, index)"/>
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
    </BaseModal> -->
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"
import BaseCheckbox from "./BaseCheckbox.vue";
import { defineComponent } from "vue";
import type { Contributor, Publication } from "hiddentreasures-js";
import { useSessionStore } from "@/stores/session";
import BaseButton from "./BaseButton.vue";
import { SearchIcon } from "@heroicons/vue/solid";
import { TransitionRoot } from "@headlessui/vue";

export default defineComponent({
    name: "filter-modal",
    components: {
    BaseModal,
    BaseCheckbox,
    BaseButton,
    SearchIcon,
    TransitionRoot,
},
    data: () => ({
        store: useSessionStore(),
        publicationCheckBoxArray: [] as boolean[],
        authorCheckBoxArray: [] as boolean[],
        onlyFavorites: false as boolean,
        showAuthors: false as boolean,
        showPublications: false as boolean,
    }),
    emits: ["close:withSearch", "publicationIdArray:publicationIdArray", "contributorIdArray:contributorIdArray", "onlyFavorites:onlyFavorites", "close"],
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
        },
        hidePublications: {
            type: Boolean,
            default: false
        },
        hideAuthors: {
            type: Boolean,
            default: false
        },
        show: {
            type: Boolean,
        },
    },
    computed: {
        allPublications() : Publication[]{
            return Array.from(this.store.publications.values()).sort((a: Publication, b: Publication) => a.title.localeCompare(b.title, "no"));
        },
        allAuthors() : Contributor[]{
            return Array.from(this.store.authors.values()).sort((a: Contributor, b: Contributor) => a.name.localeCompare(b.name, "no"));
        },
        globalCloseModalEvent() {
          return this.store.globalCloseModal;
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
        },
        globalCloseModalEvent(){
            if (this.show) this.$emit('close');
        }
    },
    methods: {
        setInitialPublicationValue(id : string, index: number){
            if (!this.initialPublicationIds.includes(id))
            {
                this.publicationCheckBoxArray[index] = false
            }  else {
                this.publicationCheckBoxArray[index] = true
            }
        },
        setInitialAuthorValue(id : string, index: number){
            if (!this.initialAuthorIds.includes(id))
            {
                this.authorCheckBoxArray[index] = false
            }  else {
                this.authorCheckBoxArray[index] = true
            }
        },
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
            this.showPublications = false;
            this.showAuthors = false
        },
    },
});
</script>

<style>
.max-h-50-percent{
    max-height: 50vh;
}
.w-half-screen{
    width: 50vw
}
.max-w-80-percent{
    max-width: 80%
}
</style>