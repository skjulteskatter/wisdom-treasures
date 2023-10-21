<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
    <div class="flex px-5 sm:px-0" :class="atLeastOneFilterIsActive ? 'pt-4' : ''">
        <div id="filterSection" class="flex flex-col max-h-24 overflow-auto">
            <div id="filterButtons" class="flex gap-1 flex-wrap">

                <div v-if="store.publicationIdSearchFilter.length > 0" v-for="publication in publicationIdFilterPublications" :key="publication.id" class="flex items-center rounded-md bg-transparent shadow-sm border-black/20 border-2">
                    <p class="max-w-xxs truncate pl-2 text-inherit text-xs">{{ publication.title }}</p> 
                    <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.publicationIdSearchFilter = store.publicationIdSearchFilter.filter(x => x != publication.id); search(); syncFilter();}">
                        <XIcon class="h-4 opacity-80"/>
                    </BaseButton>
                </div>

                <div v-if="store.authorIdSearchFilter.length > 0" v-for="author in authorIdFilterAuthors" :key="author.id" class="flex items-center rounded-md bg-transparent shadow-sm border-black/20 border-2">
                    <p class="max-w-xxs truncate pl-2 text-inherit text-xs">{{ author.name }}</p> 
                    <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.authorIdSearchFilter = store.authorIdSearchFilter.filter(x => x != author.id); search(); syncFilter();}">
                        <XIcon class="h-4 opacity-80"/>
                    </BaseButton>
                </div>

                <div v-if="store.originIdSearchFilter.length > 0" v-for="origin in originIdFilterOrigins" :key="origin.id" class="flex items-center rounded-md bg-transparent shadow-sm border-black/20 border-2">
                    <p class="max-w-xxs truncate pl-2 text-inherit text-xs">{{ origin.name }}</p> 
                    <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.originIdSearchFilter = store.originIdSearchFilter.filter(x => x != origin.id); search(); syncFilter();}">
                        <XIcon class="h-4 opacity-80"/>
                    </BaseButton>
                </div>

                <div v-if="store.onlyFavoriteSearchFilter" class="flex items-center rounded-md bg-transparent shadow-sm border-black/20 border-2">
                    <p class="max-w-xxs text-inherit truncate pl-2 text-xs">Favorites Only</p>
                    <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.onlyFavoriteSearchFilter = false; search(); syncFilter();}">
                        <XIcon class="h-4 opacity-80"/>
                    </BaseButton>
                </div>
                

                <div v-if="atLeastOneFilterIsActive" class="flex items-center rounded-md w-min bg-black/10 shadow-sm">
                    <BaseButton theme="filterXBtn" class="self-center max-h-7" @click="resetAllFilter">
                        <p class="w-max text-inherit text-xs">Reset all</p>
                    </BaseButton>
                </div>

            </div>
        </div>
    </div>

    <div v-if="atLeastOneFilterIsActive && !forSearchModal" class="w-5/6 sm:w-2/5 h-[0.075rem] sm:h-[0.1rem] bg-[color:var(--wt-color-secondary-light)] opacity-50 mr-auto ml-auto mt-6"/>

</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import { useSessionStore } from '@/stores/session';
import BaseButton from '../BaseButton.vue';
import type { Origin } from '@/classes/Origin';
import type { AudioClip } from '@/classes/AudioClip';
import { XIcon } from "@heroicons/vue/solid";
export default defineComponent({
    name: "FilterButtonGroup",
    components: {
    BaseButton,
    XIcon
},
    data() {
        return {
            store: useSessionStore(),

            articleHits: [] as Article[],
            audioClipHits: [] as AudioClip[],
            authorHits: [] as Contributor[],
            themeHits: [] as Publication[],
            originHits: [] as Origin[],

            showFilterModal: false as boolean,

            maxNumberOfArticlesOrAudioClipsDisplayed: 100000 as number,
        }
    },
    props: {
        initialThemeFilter: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        initialAuthorFilter: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        initialOriginFilter: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        returnAllIfNoHits: {
            type: Boolean,
            default: false
        },
        searchOnLoad: {
            type: Boolean,
            default: false
        },
        forSearchModal: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["search"],
    computed: {
        atLeastOneFilterIsActive(): boolean{
            return this.store.authorIdSearchFilter.length + this.store.publicationIdSearchFilter.length + this.store.originIdSearchFilter.length > 0 || this.store.onlyFavoriteSearchFilter; 
        },
        allThemes() : Publication[] {
            return Array.from(this.store.publications.values());
        },
        allAuthors() : Contributor[] {
            return Array.from(this.store.authors.values());
        },
        allOrigins() : Origin[] {
            return Array.from(this.store.origins.values());
        },
        publicationIdFilterPublications(): Publication[] {
            return this.allThemes.filter((x: { id: any; }) => this.store.publicationIdSearchFilter.includes(x.id));
        },
        authorIdFilterAuthors(): Contributor[] {
            return this.allAuthors.filter((x: { id: any; }) => this.store.authorIdSearchFilter.includes(x.id));
        },
        originIdFilterOrigins(): Origin[] {
            return this.allOrigins.filter((x: Origin) => this.store.originIdSearchFilter.includes(x.id));
        },

    },
    methods: {
        async search() {
            this.$emit("search");
        },
        resetAllFilter(){
            this.store.publicationIdSearchFilter = [];
            this.store.audioClipIdSearchFilter = [];
            this.store.authorIdSearchFilter = [];
            this.store.originIdSearchFilter = [];
            this.store.onlyFavoriteSearchFilter = false; 
            this.syncFilter();
            this.search();
        },
        syncFilter(){
            this.store.syncSearchFilter++;
        }
    },
    created() {
        if (this.searchOnLoad) {
            this.search();
        }
    },
});
</script>

<style scoped>
.max-w-xxs{
    max-width: 15rem
}
</style>
