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
                        <FilterModal :show="showFilterModal" @close="() => {showFilterModal = false; search(undefined)}"
                            @publication-id-array:publication-id-array="setPublicationIdFilter"
                            @contributor-id-array:contributor-id-array="setAuthorIdFilter"
                            :initialPublicationIds="publicationIdFilter"
                            :initialAuthorIds="authorIdFilter"/>
                    </BaseButton>
                    <div id="filterButtons" class="flex gap-4 mt-4 flex-wrap">

                        <div v-for="publication in publicationIdFilterPublications" :key="publication.id" class="flex items-center rounded-md w-min bg-black/10">
                            <p class="w-max pl-2 pr-1">Publication: {{ publication.title }}</p> 
                            <BaseButton theme="menuButton" size="small" class="w-7 self-center max-h-7" @click="()=>{publicationIdFilter = publicationIdFilter.filter(x => x != publication.id); search(undefined)}">
                                <XIcon class="h-6"/>
                            </BaseButton>
                        </div>


                        <div v-if="publicationIdFilter.length > 0" class="flex items-center rounded-md w-min bg-black/10">
                            <p class="w-max pl-2 pr-1">Reset all</p> 
                            <BaseButton theme="menuButton" size="small" class="w-7 self-center max-h-7" @click="()=>{publicationIdFilter = publicationIdFilter.filter(x => x != publication.id); search(undefined)}">
                                <XIcon class="h-6"/>
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

            processingSearch: false as boolean,
        }
    },
    props: {
        initialSearchWord: {
            type: String,
            default: "",
        },
    },
    emits: ["authors:authorHits", "themes:themeHits", "articles:articleHits", "searchedWord:searchedWord", "processingSearch:processingSearch"],
    computed: {
        allArticles() : Article[] {
            return Array.from(this.store.articles.values());
        },
        allThemes() : Publication[] {
            return Array.from(this.store.publications.values());
        },
        allAuthors() : Contributor[] {
            return [];
            //TODO implement authors
        },
        numberOfResults() : number {
            return this.articleHits.length + this.authorHits.length + this.themeHits.length;
        },
        onlySearchForArticles(): boolean {
            return this.publicationIdFilter.length > 0 || this.authorIdFilter.length > 0;
        },
        publicationIdFilterPublications(): Publication[] {
            return this.allThemes.filter(x => this.publicationIdFilter.includes(x.id));
        },
        authorIdFilterAuthors(): Contributor[] {
            return this.allAuthors.filter(x => this.authorIdFilter.includes(x.id));
        }
    },
    methods: {
        async search(searchWord: string | undefined) {
            
            if (searchWord === undefined)
                searchWord = this.searchWord ?? "";

            this.searchedWord = searchWord;

            if (!this.onlySearchForArticles) {
                this.themeHits = this.allThemes.filter(x => 
                    (x.title.includes(this.searchedWord) || x.description.includes(this.searchedWord))
                );
            } else this.themeHits = [];

            this.$emit('themes:themeHits', this.themeHits);

            if (!this.onlySearchForArticles) {
                this.authorHits = this.allAuthors.filter(x => 
                    (x.name.includes(this.searchedWord) || (x.subtitle ?? "").includes(this.searchedWord) || (x.biography ?? "").includes(this.searchedWord))
                );
            } else this.authorHits = [];

            this.$emit('authors:authorHits', this.themeHits);
            
            this.articleHits = this.allArticles.filter(x => 
                x.content?.content.includes(this.searchedWord) &&
                (this.publicationIdFilter.length === 0 || this.publicationIdFilter.includes(x.publicationId)) &&
                (this.authorIdFilter.length === 0 || this.authorIdFilter.includes(x.authorId)) &&
                (this.favoriteFilter === undefined || this.store.favorites.includes(x.id) === this.favoriteFilter)
            );
            this.$emit('articles:articleHits', this.articleHits);

            this.$emit('searchedWord:searchedWord', this.searchedWord);
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