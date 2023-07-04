<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
        <div class="flex flex-col px-5 sm:px-0 pb-4 bg-primary sm:bg-transparent">
            <div class="flex">
            <BaseInput v-model="store.searchWord" style-type="search" class="sm:hidden grow" size="" :whiteText="true" :forMultiSearch="true" placeholder="Search..." @search-action="search()"/>
            <BaseInput v-model="store.searchWord" style-type="search" class="hidden sm:block grow" size="" :forMultiSearch="true" placeholder="Search..." @search-action="search()"/>
            <BaseButton theme="menuButton" class="flex h-min w-min" @click="showFilterModal = !showFilterModal" :forMultiSearch="true" :whiteText="true">
                <template #icon>
                    <AdjustmentsIcon class="w-4"/>
                </template>
            </BaseButton>
            </div>
            <FilterModal
                    :key="filterModalKey" 
                    :show="showFilterModal" 
                    @close:with-search="(searchOnClose: any) => {if (searchOnClose) {search()}}"
                    :hidePublications="initialThemeFilter.length > 0"
                    :hideAuthors="initialAuthorFilter.length > 0"/>
        </div>

            <div class="flex px-5 sm:px-0" :class="atLeastOneFilterIsActive ? 'bg-primary pb-4 sm:bg-transparent sm:pb-0' : ''">
                <div id="filtersection" class="flex-grow flex flex-col">
                    <div id="filterButtons" class="flex gap-2 flex-wrap">

                        <div v-if="store.publicationIdSearchFilter.length > 0" v-for="publication in publicationIdFilterPublications" :key="publication.id" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs truncate pl-2 text-white sm:text-inherit text-xs">{{ publication.title }}</p> 
                            <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.publicationIdSearchFilter = store.publicationIdSearchFilter.filter(x => x != publication.id); search(); syncFilter();}">
                                <XIcon class="h-4 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="store.authorIdSearchFilter.length > 0" v-for="author in authorIdFilterAuthors" :key="author.id" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs truncate pl-2 text-white sm:text-inherit text-xs">{{ author.name }}</p> 
                            <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.authorIdSearchFilter = store.authorIdSearchFilter.filter(x => x != author.id); search(); syncFilter();}">
                                <XIcon class="h-4 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="store.onlyFavoriteSearchFilter" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs text-white sm:text-inherit truncate pl-2 text-xs">Favorites Only</p>
                            <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.onlyFavoriteSearchFilter = false; search(); syncFilter();}">
                                <XIcon class="h-4 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="atLeastOneFilterIsActive" class="flex items-center rounded-md w-min bg-black/20">
                            <BaseButton theme="filterXBtn" class="self-center max-h-7" @click="resetAllFilter">
                                <p class="w-max defaultFontSize text-white sm:text-inherit text-xs">Reset all</p>
                            </BaseButton>
                        </div>

                    </div>
                </div>
            </div>


</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import { useSessionStore } from '@/stores/session';
import BaseInput from '../BaseInput.vue';
import BaseButton from '../BaseButton.vue';
import { AdjustmentsIcon, XIcon } from '@heroicons/vue/outline';
import FilterModal from './FilterModal.vue';
import type Fuse from 'fuse.js';

export default defineComponent({
    name: "multi-search",
    components: {
    BaseInput,
    BaseButton,
    AdjustmentsIcon,
    FilterModal,
    XIcon,
},
    data() {
        return {
            store: useSessionStore(),

            articleHits: [] as Article[],
            authorHits: [] as Contributor[],
            themeHits: [] as Publication[],

            showFilterModal: false as boolean,

            maxNumberOfArticlesDisplayed: 100000 as number,

            filterModalKey: 0 as number,
        }
    },
    props: {
        inSearchView:{
            type: Boolean,
            default: false
        },
        initialThemeFilter: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        initialAuthorFilter: {
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
    emits: ["authors:authorHits", "themes:themeHits", "articles:articleHits", "searchedWord:searchedWord", "searchLoading:searchLoading"],
    computed: {
        atLeastOneFilterIsActive(): boolean{
            return this.store.authorIdSearchFilter.length + this.store.publicationIdSearchFilter.length > 0 || this.store.onlyFavoriteSearchFilter; 
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
        numberOfResults() : number {
            return this.articleHits.length + (!this.onlySearchForArticles ? this.authorHits.length + this.themeHits.length : 0);
        },
        onlySearchForArticles(): boolean {
            return this.atLeastOneFilterIsActive;
        },
        publicationIdFilterPublications(): Publication[] {
            return this.allThemes.filter((x: { id: any; }) => this.store.publicationIdSearchFilter.includes(x.id));
        },
        authorIdFilterAuthors(): Contributor[] {
            return this.allAuthors.filter((x: { id: any; }) => this.store.authorIdSearchFilter.includes(x.id));
        },
        fuseArticles() : Fuse<Article> | undefined {
            return this.store.fuseArticles;
        },
        fusePublications() : Fuse<Publication> | undefined{
            return this.store.fusePublications;
        },
        fuseAuthors(): Fuse<Contributor> | undefined{
            return this.store.fuseAuthors;
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

                this.$emit('themes:themeHits', this.onlySearchForArticles ? [] : this.themeHits);

                this.authorHits = this.allAuthors.filter((x: { name: string | any[]; subtitle: any; biography: any; }) => 
                    (x.name.includes(searchWord) || (x.subtitle ?? "").includes(searchWord) || (x.biography ?? "").includes(searchWord))
                );

                this.$emit('authors:authorHits', this.onlySearchForArticles ? [] : this.authorHits);

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

                console.log(JSON.stringify(query, null, 2));
                if (this.fuseArticles !== undefined){
                    
                    let result: Fuse.FuseResult<Article>[] = [];
                    if ('$and' in query && query.$and?.length){ result = this.fuseArticles.search(query) }
                    else if ('$or' in query && query.$or?.length){ result = this.fuseArticles.search(query) }

                    this.articleHits = (result.length ? result.map(x => x.item) : this.allArticles);
                }

                if (this.returnAllIfNoHits && this.articleHits.length <= 0){
                    this.articleHits = Array.from(this.store.articles.values());
                }

                if (this.store.onlyFavoriteSearchFilter)
                {
                    this.articleHits = this.articleHits.filter((x: { id: any; }) => this.store.favorites.includes(x.id));
                }

                if (this.initialThemeFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { publicationId: any; }) => this.initialThemeFilter.includes(x.publicationId));
                }
                else if (this.store.publicationIdSearchFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { publicationId: any; }) => this.store.publicationIdSearchFilter.includes(x.publicationId));
                }

                if (this.initialAuthorFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { authorId: any; }) => this.initialAuthorFilter.includes(x.authorId));
                }
                else if (this.store.authorIdSearchFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { authorId: any; }) => this.store.authorIdSearchFilter.includes(x.authorId));
                }

                this.articleHits = this.articleHits.slice(0,this.maxNumberOfArticlesDisplayed);

                this.$emit('articles:articleHits', this.articleHits);

                this.$emit('searchedWord:searchedWord', searchWord);
                
                this.$emit('searchLoading:searchLoading', false);
            }, 1);
        },
        resetAllFilter(){
            this.store.publicationIdSearchFilter = [];
            this.store.authorIdSearchFilter = [];
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