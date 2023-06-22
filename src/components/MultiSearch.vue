<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
        <div class="flex flex-col px-5 sm:px-0" :class="inSearchView ? 'pb-4 sm:pb-0 bg-primary sm:bg-transparent ': ''">
            <div class="flex">
            <BaseInput v-model="searchWord" style-type="search" class="sm:hidden grow" size="" :whiteText="inSearchView ? true : false" :forMultiSearch="true" placeholder="Search..." @search-action="search($event)"/>
            <BaseInput v-model="searchWord" style-type="search" class="hidden sm:block grow" size="" :forMultiSearch="true" placeholder="Search..." @search-action="search($event)"/>
            <BaseButton theme="menuButton" class="flex h-min w-min" @click="showFilterModal = !showFilterModal" :forMultiSearch="true" :whiteText="inSearchView ? true : false">
                <template #icon>
                    <AdjustmentsIcon class="w-4"/>
                </template>
            </BaseButton>
            </div>
            <FilterModal
                    :key="filterModalKey" 
                    :show="showFilterModal" 
                    @close:with-search="(searchOnClose: any) => {if (searchOnClose) {search(undefined)}}"
                    :hidePublications="initialThemeFilter.length > 0"
                    :hideAuthors="initialAuthorFilter.length > 0"/>
        </div>
        <hr v-if="atLeastOneFilterIsActive" class="mx-5" style="background-color: rgb(63, 63, 63);"/>

            <div class="flex px-5 sm:px-0" :class="atLeastOneFilterIsActive ? 'pt-4' : ''">
                <div id="filtersection" class="flex-grow flex flex-col">
                    <div id="filterButtons" class="flex gap-2 flex-wrap">

                        <div v-if="store.publicationIdSearchFilter.length > 0" v-for="publication in publicationIdFilterPublications" :key="publication.id" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs truncate pl-2 text-xs">{{ publication.title }}</p> 
                            <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.publicationIdSearchFilter = store.publicationIdSearchFilter.filter(x => x != publication.id); search(undefined); syncFilter();}">
                                <XIcon class="h-4 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="store.authorIdSearchFilter.length > 0" v-for="author in authorIdFilterAuthors" :key="author.id" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs truncate pl-2 text-white text-xs">{{ author.name }}</p> 
                            <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.authorIdSearchFilter = store.authorIdSearchFilter.filter(x => x != author.id); search(undefined); syncFilter();}">
                                <XIcon class="h-4 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="store.onlyFavoriteSearchFilter" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs text-white truncate pl-2 text-xs">Favorites Only</p>
                            <BaseButton theme="filterXBtn" class="w-5 self-center max-h-7" @click="()=>{store.onlyFavoriteSearchFilter = false; search(undefined); syncFilter();}">
                                <XIcon class="h-4 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="atLeastOneFilterIsActive" class="flex items-center rounded-md w-min bg-black/20">
                            <BaseButton theme="filterXBtn" class="self-center max-h-7" @click="resetAllFilter">
                                <p class="w-max defaultFontSize text-white text-xs">Reset all</p>
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
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
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
            searchWord: "" as string,
            searchedWord: "" as string,

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
        initialSearchWord: {
            type: String,
            default: "",
        },
        initialThemeFilter: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        initialAuthorFilter: {
            type: Array as PropType<string[]>,
            default: () => []
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
        async search(searchWord: string | undefined) {

            this.$emit('searchLoading:searchLoading', true);
            
            setTimeout(() => {
                if (searchWord === undefined)
                    searchWord = this.searchWord ?? "";

                this.searchedWord = searchWord;

                if (this.fusePublications !== undefined){
                    const result = this.fusePublications.search(searchWord);
                    this.themeHits = result.map((x: { item: any; }) => x.item);
                }

                this.$emit('themes:themeHits', this.onlySearchForArticles ? [] : this.themeHits);

                this.authorHits = this.allAuthors.filter((x: { name: string | any[]; subtitle: any; biography: any; }) => 
                    (x.name.includes(this.searchedWord) || (x.subtitle ?? "").includes(this.searchedWord) || (x.biography ?? "").includes(this.searchedWord))
                );

                this.$emit('authors:authorHits', this.onlySearchForArticles ? [] : this.authorHits);

                let  query: Fuse.Expression = {
                    $and: []
                }

                if (this.searchedWord.trim().length > 1){
                    query.$and!.push(
                        {
                            $or: [
                                {
                                    $path: ['content', 'content'],
                                    $val: this.searchedWord
                                },
                                { dateWritten: this.searchedWord },
                                { number: `'${this.searchedWord}` },
                            ]
                        }
                    )
                }

                //let orPublicationFilter = this.publicationIdFilter.map(id => ({publicationId : `'${id}`}));
                //if (this.publicationIdFilter.length > 0){
                //    query.$and!.push( 
                //        {$or: orPublicationFilter}
                //    )
                //}

                //let orAuthorFilter = this.authorIdFilter.map(id => ({authorId : `'${id}`}));
                //if (this.authorIdFilter.length > 0){
                //    query.$and!.push( 
                //        {$or: orAuthorFilter}
                //    )
                //}

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

                this.$emit('searchedWord:searchedWord', this.searchedWord);
                
                this.$emit('searchLoading:searchLoading', false);
            }, 1);
        },
        resetAllFilter(){
            this.store.publicationIdSearchFilter = [];
            this.store.authorIdSearchFilter = [];
            this.store.onlyFavoriteSearchFilter = false; 
            this.syncFilter();
            this.search(undefined);
        },
        syncFilter(){
            this.store.syncSearchFilter++;
        }
    },
    created() {
        if (this.initialSearchWord != "") {
            this.search(this.initialSearchWord);
        }
    },
    watch: {
        async initialSearchWord(newValue: string){
            if (newValue == "") return;
            await this.search(newValue);
        }
    }
});
</script>

<style scoped>
/* .defaultFontSize {
    font-size: var(--wt-default-font-size);
} */
.max-w-xxs{
    max-width: 15rem
}

.--white {
        @apply text-white;
}
</style>