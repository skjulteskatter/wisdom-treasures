<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
    <div class="flex flex-col px-5 sm:px-0 pb-4 sm:pb-0 bg-primary sm:bg-transparent">
        <div class="flex">
        <BaseInput v-model="store.searchWord" style-type="search" class="sm:hidden grow" size="" :whiteText="true" :forMultiSearch="true" placeholder="Search..." @search-action="search()"/>
        <BaseInput v-model="store.searchWord" style-type="search" class="hidden sm:block grow" size="" :forMultiSearch="true" placeholder="Search..." @search-action="search()"/>
        <BaseButton theme="menuButton" class="flex h-min w-min " @click="showFilterModal = !showFilterModal" :forMultiSearch="true" :whiteText="true">
            <template #icon>
                <AdjustmentsIcon class="w-4"/>
            </template>
        </BaseButton>
        </div>
        <FilterModal
            ref="filterModalRef"
            :show="showFilterModal" 
            @close:with-search="(searchOnClose: any) => {if (searchOnClose) {search()}}"
            :hidePublications="initialThemeFilter.length > 0"
            :hideAuthors="initialAuthorFilter.length > 0"
            :hideOrigins="initialOriginFilter.length > 0"/>
    </div>

    <FilterButtonGroup @search="search"/>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import { useSessionStore } from '@/stores/session';
import BaseInput from '../BaseInput.vue';
import BaseButton from '../BaseButton.vue';
import { AdjustmentsIcon } from '@heroicons/vue/outline';
import FilterModal from './FilterModal.vue';
import type Fuse from 'fuse.js';
import type { Origin } from '@/classes/Origin';
import type { AudioClip } from '@/classes/AudioClip';
import { log } from '@/services/logger'
import FilterButtonGroup from './FilterButtonGroup.vue';

export default defineComponent({
    name: "multi-search",
    components: {
    BaseInput,
    BaseButton,
    AdjustmentsIcon,
    FilterModal,
    FilterButtonGroup
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
    },
    emits: ["authors:authorHits", "themes:themeHits", "origin:originHits", "articles:articleHits", "audioClips:audioClipHits", "origins:originHits", "searchedWord:searchedWord", "searchLoading:searchLoading"],
    computed: {
        atLeastOneFilterIsActive(): boolean{
            return this.store.authorIdSearchFilter.length + this.store.publicationIdSearchFilter.length + this.store.originIdSearchFilter.length > 0 || this.store.onlyFavoriteSearchFilter; 
        },
        allArticles() : Article[] {
            return Array.from(this.store.articles.values());
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
        allAudioClips() : AudioClip[] {
            return Array.from(this.store.audioClips.values());
        },
        numberOfResults() : number {
            return this.articleHits.length + (!this.onlySearchForArticlesAndAudioClips ? this.authorHits.length + this.themeHits.length + this.originHits.length : 0);
        },
        onlySearchForArticlesAndAudioClips(): boolean {
            return this.atLeastOneFilterIsActive;
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
        fuseArticles() : Fuse<Article> | undefined {
            return this.store.fuseArticles;
        },
        fuseAudioClips() : Fuse<AudioClip> | undefined {
            return this.store.fuseAudioClips;
        },
        fusePublications() : Fuse<Publication> | undefined{
            return this.store.fusePublications;
        },
        fuseAuthors(): Fuse<Contributor> | undefined{
            return this.store.fuseAuthors;
        },
        fuseOrigins(): Fuse<Origin> | undefined{
            return this.store.fuseOrigins;
        },
    },
    methods: {
        async search() {

            this.$emit('searchLoading:searchLoading', true);
            
            setTimeout(() => {
                let searchWord = this.store.searchWord;

                if (this.fusePublications !== undefined){
                    const result = this.fusePublications.search(searchWord);
                    this.themeHits = result.map((x: { item: any; }) => x.item);
                }

                this.$emit('themes:themeHits', this.onlySearchForArticlesAndAudioClips ? [] : this.themeHits);

                if (this.fuseAuthors !== undefined){
                    const result = this.fuseAuthors.search(searchWord);
                    this.authorHits = result.map((x: { item: any; }) => x.item);
                }

                this.$emit('authors:authorHits', this.onlySearchForArticlesAndAudioClips ? [] : this.authorHits);

                if (this.fuseOrigins !== undefined){
                    const result = this.fuseOrigins.search(searchWord);
                    this.originHits = result.map((x: { item: any; }) => x.item);
                }

                this.$emit('origins:originHits', this.onlySearchForArticlesAndAudioClips ? [] : this.originHits);

                let  query: Fuse.Expression = {
                    $and: []
                }

                if (searchWord.trim().length > 1){
                    query.$and!.push(
                        {
                            $or: [
                                {
                                    $path: ['content', 'content'],
                                    $val: searchWord
                                },
                                { dateWritten: searchWord },
                                { number: `'${searchWord}` },
                            ]
                        }
                    )
                }

                if (query.$and?.[0] && query.$and.length == 1){
                    query = query.$and![0];
                }

                log && console.log(JSON.stringify(query, null, 2));
                if (this.fuseArticles !== undefined){
                    
                    let result: Fuse.FuseResult<Article>[] = [];
                    if ('$and' in query && query.$and?.length){ result = this.fuseArticles.search(query) }
                    else if ('$or' in query && query.$or?.length){ result = this.fuseArticles.search(query) }

                    this.articleHits = (result.length ? result.map(x => x.item) : this.allArticles);
                }

                log && console.log(JSON.stringify(query, null, 2));
                if (this.fuseAudioClips !== undefined){
                    
                    let result: Fuse.FuseResult<AudioClip>[] = [];
                    if ('$and' in query && query.$and?.length){ result = this.fuseAudioClips.search(query) }
                    else if ('$or' in query && query.$or?.length){ result = this.fuseAudioClips.search(query) }

                    this.audioClipHits = (result.length ? result.map(x => x.item) : this.allAudioClips);
                }

                if (this.returnAllIfNoHits && this.articleHits.length <= 0){
                    this.articleHits = Array.from(this.store.articles.values());
                    this.audioClipHits = Array.from(this.store.audioClips.values());
                }

                if (this.store.onlyFavoriteSearchFilter)
                {
                    this.articleHits = this.articleHits.filter((x: { id: any; }) => this.store.favorites.includes(x.id));
                    this.audioClipHits = this.audioClipHits.filter((x: { id: any; }) => this.store.favorites.includes(x.id));
                }

                if (this.initialThemeFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { publicationId: any; }) => this.initialThemeFilter.includes(x.publicationId));
                    this.audioClipHits = this.audioClipHits.filter((x: { publicationId: any; }) => this.initialThemeFilter.includes(x.publicationId));
                }
                else if (this.store.publicationIdSearchFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { publicationId: any; }) => this.store.publicationIdSearchFilter.includes(x.publicationId));
                    this.audioClipHits = this.audioClipHits.filter((x: { publicationId: any; }) => this.store.publicationIdSearchFilter.includes(x.publicationId));
                }

                if (this.initialAuthorFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { authorId: any; }) => this.initialAuthorFilter.includes(x.authorId));
                    this.audioClipHits = this.audioClipHits.filter((x: { authorId: any; }) => this.initialAuthorFilter.includes(x.authorId));
                }
                else if (this.store.authorIdSearchFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { authorId: any; }) => this.store.authorIdSearchFilter.includes(x.authorId));
                    this.audioClipHits = this.audioClipHits.filter((x: { authorId: any; }) => this.initialAuthorFilter.includes(x.authorId));
                }

                if (this.initialOriginFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: Article) => this.initialOriginFilter.includes(x.sourceId || "⛄"));
                    this.audioClipHits = this.audioClipHits.filter((x: AudioClip) => this.initialOriginFilter.includes(x.sourceId || "⛄"));
                }
                else if (this.store.originIdSearchFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: Article) => this.store.originIdSearchFilter.includes(x.sourceId || "⛄"));
                    this.audioClipHits = this.audioClipHits.filter((x: AudioClip) => this.initialOriginFilter.includes(x.sourceId || "⛄"));
                }

                this.articleHits = this.articleHits.slice(0,this.maxNumberOfArticlesOrAudioClipsDisplayed);
                this.audioClipHits = this.audioClipHits.slice(0,this.maxNumberOfArticlesOrAudioClipsDisplayed);

                this.$emit('articles:articleHits', this.articleHits);

                this.$emit('audioClips:audioClipHits', this.audioClipHits);

                this.$emit('searchedWord:searchedWord', searchWord);
                
                this.$emit('searchLoading:searchLoading', false);
            }, 1);
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

.--white {
    @apply text-white;
}
</style>
