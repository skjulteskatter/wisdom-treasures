<template>
    <BaseCard class="mt-4">
        <template #header> 
            <div class="font-sans">
                <div v-if="searchedWord" class="font-bold">
                    Showing {{numberOfResults}} Results for "{{searchedWord}}"
                </div>
                <div v-else class="font-bold">
                    Search
                </div>
            </div>
        </template>
            <BaseInput v-model="searchWord" style-type="search" size="lg" @search-action="search($event)"/>
        <template #footer>
            <div class="flex">
                <div id="filtersection" class="flex-grow flex flex-col">
                    <BaseButton theme="menuButton" class="border border-black/20 flex h-min w-min" @click="showFilterModal = true">
                        Filter
                        <template #icon>
                            <AdjustmentsIcon class="w-5"/>
                        </template>
                        <FilterModal :show="showFilterModal" @close:with-search="(searchOnClose) => {showFilterModal = false; if (searchOnClose) {search(undefined)}}"
                            @publication-id-array:publication-id-array="setPublicationIdFilter"
                            @contributor-id-array:contributor-id-array="setAuthorIdFilter"
                            :initialPublicationIds="publicationIdFilter"
                            :initialAuthorIds="authorIdFilter"/>
                    </BaseButton>
                    <div id="filterButtons" class="flex gap-4 mt-4 flex-wrap">

                        <div v-for="publication in publicationIdFilterPublications" :key="publication.id" class="flex items-center rounded-md w-min bg-black/10">
                            <p class="w-max pl-2 pr-1">Publication: {{ publication.title }}</p> 
                            <BaseButton theme="menuButton" class="w-7 self-center max-h-7" @click="()=>{publicationIdFilter = publicationIdFilter.filter(x => x != publication.id); search(undefined)}">
                                <XIcon class="h-6"/>
                            </BaseButton>
                        </div>

                        <div v-for="author in authorIdFilterAuthors" :key="author.id" class="flex items-center rounded-md w-min bg-black/10">
                            <p class="w-max pl-2 pr-1">Author: {{ author.name }}</p> 
                            <BaseButton theme="menuButton" class="w-7 self-center max-h-7" @click="()=>{authorIdFilter = authorIdFilter.filter(x => x != author.id); search(undefined)}">
                                <XIcon class="h-6"/>
                            </BaseButton>
                        </div>


                        <div v-if="publicationIdFilter.length > 0" class="flex items-center rounded-md w-min bg-black/10">
                            <BaseButton theme="menuButton" class="self-center max-h-7" @click="()=>{publicationIdFilter = []; search(undefined)}">
                                <p class="w-max pl-2 pr-1 defaultFontSize">Reset all</p>
                            </BaseButton>
                        </div>

                    </div>
                </div>
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
            </div>
        </template>
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseCard from './BaseCard.vue';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import { useSessionStore } from '@/stores/session';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import { AdjustmentsIcon, SwitchVerticalIcon, XIcon } from '@heroicons/vue/outline';
import FilterModal from './FilterModal.vue';
import type Fuse from 'fuse.js';
import { stringLength } from '@firebase/util';

export default defineComponent({
    name: "multi-search",
    components: {
    BaseCard,
    BaseInput,
    BaseButton,
    AdjustmentsIcon,
    SwitchVerticalIcon,
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
            favoriteFilter: undefined as boolean | undefined,
            authorIdFilter: [] as string[],

            showFilterModal: false as boolean,
            showSortModal: false as boolean,

            maxNumberOfArticlesDisplayed: 100 as number,
        }
    },
    props: {
        initialSearchWord: {
            type: String,
            default: "",
        },
    },
    emits: ["authors:authorHits", "themes:themeHits", "articles:articleHits", "searchedWord:searchedWord", "searchLoading:searchLoading"],
    computed: {
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
            return this.publicationIdFilter.length > 0 || this.authorIdFilter.length > 0;
        },
        publicationIdFilterPublications(): Publication[] {
            return this.allThemes.filter(x => this.publicationIdFilter.includes(x.id));
        },
        authorIdFilterAuthors(): Contributor[] {
            return this.allAuthors.filter(x => this.authorIdFilter.includes(x.id));
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
                    this.themeHits = result.map(x => x.item);
                }

                this.$emit('themes:themeHits', this.onlySearchForArticles ? [] : this.themeHits);

                this.authorHits = this.allAuthors.filter(x => 
                    (x.name.includes(this.searchedWord) || (x.subtitle ?? "").includes(this.searchedWord) || (x.biography ?? "").includes(this.searchedWord))
                );

                this.$emit('authors:authorHits', this.onlySearchForArticles ? [] : this.authorHits);

                const query: Fuse.Expression = {
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

                let orPublicationFilter = this.publicationIdFilter.map(id => ({publicationId : `'${id}`}));
                if (this.publicationIdFilter.length > 0){
                    query.$and!.push( 
                        {$or: orPublicationFilter}
                    )
                }

                let orAuthorFilter = this.authorIdFilter.map(id => ({authorId : `'${id}`}));
                if (this.authorIdFilter.length > 0){
                    query.$and!.push( 
                        {$or: orAuthorFilter}
                    )
                }

                console.log(JSON.stringify(query, null, 2));
                if (this.fuseArticles !== undefined){
                    const result = query.$and?.length ? this.fuseArticles.search(query) : [];
                    this.articleHits = (result.length ? result.map(x => x.item) : this.allArticles).slice(0,this.maxNumberOfArticlesDisplayed);
                }

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
        setFavoriteFilter(value: boolean | undefined) {
            this.favoriteFilter = value;
        },
    },
    mounted() {
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
.defaultFontSize {
    font-size: var(--wt-default-font-size);
}
</style>