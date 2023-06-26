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
                        <button v-if="!hideAuthors" @click="showAuthors = !showAuthors, showPublications = false" class="box-border w-full border-2 rounded-full py-1.5 border-white/80 sm:border-primary text-white/80 sm:text-primary text-xs" :class="showAuthors ? 'border-b-none' : ''">author</button>
                        <transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0"
                            >
                            <div v-if="showAuthors" id="authors" class="w-half-screen absolute top-7 left-0 bg-primary sm:bg-[color:var(--wt-c-white-soft)] shadow-lg border-2 rounded-sm border-white-80 max-h-50-percent overflow-y-scroll z-50" :class="{'hidden' : hideAuthors}">
                                <div v-for="(author, index) in allAuthors" :key="index" class="flex">
                                    <label class="w-full flex gap-2 mx-2 my-2 items-center text-black cursor-pointer select-none">
                                        <BaseCheckbox v-model="authorCheckBoxArray[index]" @vnode-mounted="setInitialAuthorValue(author.id, index)"/>
                                        <p :class="{'font-bold' : authorCheckBoxArray[index] }" class="max-w-80-percent truncate text-white/80 sm:text-inherit text-xs">{{ author.name }}</p>
                                    </label>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <div id="publications">
                        <button v-if="!hidePublications" @click="showPublications = !showPublications, showAuthors = false" class="w-full border-2 rounded-full border-white/80 sm:border-primary py-1.5 text-white/80 sm:text-primary text-xs">publication</button>
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
                    <div id="favorites" @click="showPublications = false, showAuthors = false" class="z-30 border-box flex justify-center items-center transition cursor-pointer">
                        <label class="w-full h-full flex justify-center items-center">
                            <BaseCheckbox class="w-full h-full absolute opacity-0 cursor-pointer " v-model="store.onlyFavoriteSearchFilter" @click="closeWithReturnArrays(true)"/>
                            <p :class="{'bg-white/20 sm:bg-primary sm:text-white' : store.onlyFavoriteSearchFilter }" class="w-full h-full rounded-full text-center border-2 border-white/80 py-1.5 sm:border-primary text-white/80 sm:text-primary text-xs cursor-pointer">favorites</p>
                        </label>
                    </div>
                </div>
                <div v-if="showPublications || showAuthors" id="clickOutsideDetector" class="bg-transparent fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40" @click="closeWithReturnArrays(false)"/>
        </div>
    </transition>
</template>

<script lang="ts">

import BaseCheckbox from "./BaseCheckbox.vue";
import { defineComponent } from "vue";
import type { Contributor, Publication } from "hiddentreasures-js";
import { useSessionStore } from "@/stores/session";

export default defineComponent({
    name: "filter-modal",
    components: {
    BaseCheckbox,
},
    data: () => ({
        store: useSessionStore(),
        publicationCheckBoxArray: [] as boolean[],
        authorCheckBoxArray: [] as boolean[],
        showAuthors: false as boolean,
        showPublications: false as boolean,
    }),
    emits: ["close:withSearch", "close"],
    props: {
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
        },
        syncFilterCounter(){
            return this.store.syncSearchFilter;
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
        },
        syncFilterCounter(newValue: number){
            for (let index = 0; index < this.allPublications.length; index++) {
                const pub = this.allPublications[index];
                this.setInitialPublicationValue(pub.id, index);
            }
            for (let index = 0; index < this.allAuthors.length; index++) {
                const pub = this.allAuthors[index];
                this.setInitialAuthorValue(pub.id, index);
            }
            //console.log("Synced. This is a heavy operation and should not be triggered many times ⚠️")
        }
    },
    methods: {
        setInitialPublicationValue(id : string, index: number){
            if (!this.store.publicationIdSearchFilter.includes(id))
            {
                this.publicationCheckBoxArray[index] = false
            }  else {
                this.publicationCheckBoxArray[index] = true
            }
        },
        setInitialAuthorValue(id : string, index: number){
            if (!this.store.authorIdSearchFilter.includes(id))
            {
                this.authorCheckBoxArray[index] = false
            }  else {
                this.authorCheckBoxArray[index] = true
            }
        },
        closeWithReturnArrays(forceSearch: boolean = false) {
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
                publicationsArray.toString() !== this.store.publicationIdSearchFilter.toString() ||
                authorsArray.toString() !== this.store.authorIdSearchFilter.toString()

            if (withSearchOnClose){
                this.store.publicationIdSearchFilter = publicationsArray;
                this.store.authorIdSearchFilter = authorsArray;
            }
            this.$emit('close:withSearch', withSearchOnClose || forceSearch);
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