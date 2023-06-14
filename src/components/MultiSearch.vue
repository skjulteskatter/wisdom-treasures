<template>

        <!-- <template #header> 
            <div class="font-sans">
                <div v-if="searchedWord" class="font-bold">
                    Showing {{numberOfResults}} Results for "{{searchedWord}}"
                </div>
                <div v-else class="font-bold">
                    Search
                </div>
            </div>
        </template> -->
        <div class="flex px-5 sm:px-0" :class="inSearchView ? 'pb-4 sm:pb-0 bg-primary sm:bg-transparent shadow-md sm:shadow-none': ''">
            <BaseInput v-model="searchWord" style-type="search" class="sm:hidden grow" size="lg" :whiteText="inSearchView ? true : false" :forMultiSearch="true" placeholder="Search..." @search-action="search($event)"/>
            <BaseInput v-model="searchWord" style-type="search" class="hidden sm:block grow" size="lg" :forMultiSearch="true" placeholder="Search..." @search-action="search($event)"/>
            <BaseButton theme="menuButton" class="flex h-min w-min" @click="showFilterModal = true" :forMultiSearch="true" :whiteText="inSearchView ? true : false">
                <template #icon>
                    <AdjustmentsIcon class="w-5"/>
                </template>
                <FilterModal :show="showFilterModal" @close:with-search="(searchOnClose: any) => {showFilterModal = false; if (searchOnClose) {search(undefined)}}"
                    @publication-id-array:publication-id-array="setPublicationIdFilter"
                    @contributor-id-array:contributor-id-array="setAuthorIdFilter"
                    @only-favorites:only-favorites="setFavoriteFilter"
                    :initialPublicationIds="publicationIdFilter"
                    :initialAuthorIds="authorIdFilter"
                    :initialOnlyFavorites="onlyFavoriteFilter"
                    :hidePublications="initialThemeFilter.length > 0"
                    :hideAuthors="initialAuthorFilter.length > 0"/>
            </BaseButton>
        </div>

            <div class="flex px-5 sm:px-0" :class="atLeastOneFilterIsActive ? 'pt-4' : ''">
                <div id="filtersection" class="flex-grow flex flex-col">
                    <div id="filterButtons" class="flex gap-2 flex-wrap">

                        <div v-if="initialThemeFilter.length <= 0" v-for="publication in publicationIdFilterPublications" :key="publication.id" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs truncate pl-2 pr-1">{{ publication.title }}</p> 
                            <BaseButton theme="menuButton" class="w-7 self-center max-h-7" @click="()=>{publicationIdFilter = publicationIdFilter.filter(x => x != publication.id); search(undefined)}">
                                <XIcon class="h-5 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="initialAuthorFilter.length <= 0" v-for="author in authorIdFilterAuthors" :key="author.id" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs truncate pl-2 pr-1">{{ author.name }}</p> 
                            <BaseButton theme="menuButton" class="w-7 self-center max-h-7" @click="()=>{authorIdFilter = authorIdFilter.filter(x => x != author.id); search(undefined)}">
                                <XIcon class="h-5 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="onlyFavoriteFilter" class="flex items-center rounded-md bg-black/10 opacity-80">
                            <p class="max-w-xxs truncate pl-2 pr-1">Favorites Only</p>
                            <BaseButton theme="menuButton" class="w-7 self-center max-h-7" @click="()=>{onlyFavoriteFilter = false; search(undefined)}">
                                <XIcon class="h-5 opacity-70"/>
                            </BaseButton>
                        </div>

                        <div v-if="atLeastOneFilterIsActive" class="flex items-center rounded-md w-min bg-black/20">
                            <BaseButton theme="menuButton" class="self-center max-h-7" @click="resetAllFilter">
                                <p class="w-max pl-2 pr-1 defaultFontSize">Reset all</p>
                            </BaseButton>
                        </div>

                    </div>
                </div>
                <!-- We don't need sorting 
                <div id="sortSection" class="flex flex-col place-items-end">
                    <BaseButton theme="menuButton" class="border border-black/20 flex h-min w-min">
                        Sort
                        <template #icon>
                            <SwitchVerticalIcon class="w-5"/>
                        </template>
                    </BaseButton>
                    <div id="sortMessage" class="mt-4">
                        <p>Sorting by: something idk</p>
                    </div>
                </div>
                -->
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

            publicationIdFilter: [] as string[],
            onlyFavoriteFilter: false as boolean,
            authorIdFilter: [] as string[],

            showFilterModal: false as boolean,

            maxNumberOfArticlesDisplayed: 100000 as number,
        }
    },
    props: {
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
        inSearchView:{
            type: Boolean,
            default: false
        }
    },
    emits: ["authors:authorHits", "themes:themeHits", "articles:articleHits", "searchedWord:searchedWord", "searchLoading:searchLoading"],
    computed: {
        atLeastOneFilterIsActive(): boolean{

            return (this.publicationIdFilter.length + this.authorIdFilter.length) - (this.initialAuthorFilter.length + this.initialThemeFilter.length) > 0 || this.onlyFavoriteFilter; //TODO maybe a bit dirty
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
            return this.publicationIdFilter.length > 0 || this.authorIdFilter.length > 0 || this.onlyFavoriteFilter;
        },
        publicationIdFilterPublications(): Publication[] {
            return this.allThemes.filter((x: { id: any; }) => this.publicationIdFilter.includes(x.id));
        },
        authorIdFilterAuthors(): Contributor[] {
            return this.allAuthors.filter((x: { id: any; }) => this.authorIdFilter.includes(x.id));
        },
        fuseArticles() : Fuse<Article> | undefined {
            return this.store.fuseArticles;
        },
        fusePublications() : Fuse<Publication> | undefined{
            return this.store.fusePublications;
        },
        fuseAuthors(): Fuse<Contributor> | undefined{
            return this.store.fuseAuthors;
        }
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

                if (this.onlyFavoriteFilter)
                {
                    this.articleHits = this.articleHits.filter((x: { id: any; }) => this.store.favorites.includes(x.id));
                }

                if (this.publicationIdFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { publicationId: any; }) => this.publicationIdFilter.includes(x.publicationId));
                }

                if (this.authorIdFilter.length > 0){
                    this.articleHits = this.articleHits.filter((x: { authorId: any; }) => this.authorIdFilter.includes(x.authorId));
                }

                this.articleHits = this.articleHits.slice(0,this.maxNumberOfArticlesDisplayed);

                this.$emit('articles:articleHits', this.articleHits);

                this.$emit('searchedWord:searchedWord', this.searchedWord);
                
                this.$emit('searchLoading:searchLoading', false);
            }, 1);
        },
        setPublicationIdFilter(value: string[]) {
            this.publicationIdFilter = value;
        },
        setAuthorIdFilter(value: string[]) {
            this.authorIdFilter = value;
        },
        setFavoriteFilter(value: boolean) {
            this.onlyFavoriteFilter = value;
        },
        resetAllFilter(){
            this.publicationIdFilter = [];
            this.initialThemeFilter.forEach((themeId: { toString: () => any; }) => {
                this.publicationIdFilter.push(themeId.toString())
            });
            this.authorIdFilter = [];
            this.initialAuthorFilter.forEach((authorId: { toString: () => any; }) => {
                this.authorIdFilter.push(authorId.toString())
            });
            this.onlyFavoriteFilter = false; 
            this.search(undefined);
        }
    },
    created() {
        if (this.initialSearchWord != "") {
            this.search(this.initialSearchWord);
        }

        this.initialThemeFilter.forEach((themeId: any) => {
            this.publicationIdFilter.push(themeId)
        });

        this.initialAuthorFilter.forEach((authorId: any) => {
            this.authorIdFilter.push(authorId)
        });
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
.defaultFontSize {
    font-size: var(--wt-default-font-size);
}
.max-w-xxs{
    max-width: 15rem
}
</style>