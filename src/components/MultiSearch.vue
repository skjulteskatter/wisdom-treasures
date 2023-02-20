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
            <div class="flex gap-2">
                <BaseButton theme="menuButton" class="border border-black/20 flex" @click="showFilterModal = true">
                    Filter
                    <template #icon>
                        <AdjustmentsIcon class="w-5"/>
                    </template>
                    <FilterModal :show="showFilterModal" @close="showFilterModal = false"/>
                </BaseButton>
                <BaseButton theme="menuButton" class="border border-black/20 flex">
                    Sort
                    <template #icon>
                        <SwitchVerticalIcon class="w-5"/>
                    </template>
                </BaseButton>
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
import { AdjustmentsIcon, SwitchVerticalIcon  } from '@heroicons/vue/outline';
import FilterModal from './FilterModal.vue';

export default defineComponent({
    name: "multi-search",
    components: {
    BaseCard,
    BaseInput,
    BaseButton,
    AdjustmentsIcon,
    SwitchVerticalIcon,
    FilterModal
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
        }
    },
    props: {
        initialSearchWord: {
            type: String,
            default: "",
        },
    },
    emits: ["authors:authorHits", "themes:themeHits", "articles:articleHits", "searchedWord:searchedWord"],
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
        }
    },
    methods: {
        async search(searchWord: string) {
            this.searchedWord = searchWord;

            if (this.publicationIdFilter.length <= 0) {
                this.themeHits = this.allThemes.filter(x => 
                    (x.title.includes(searchWord) || x.description.includes(searchWord))
                );
            } else this.themeHits = [];

            this.$emit('themes:themeHits', this.themeHits);

            if (this.authorIdFilter.length <= 0) {
                this.authorHits = this.allAuthors.filter(x => 
                    (x.name.includes(searchWord) || (x.subtitle ?? "").includes(searchWord) || (x.biography ?? "").includes(searchWord))
                );
            } else this.authorHits = [];

            this.$emit('authors:authorHits', this.themeHits);
            
            this.articleHits = this.allArticles.filter(x => 
                x.content?.content.includes(searchWord) &&
                (this.publicationIdFilter.length === 0 || this.publicationIdFilter.includes(x.publicationId)) &&
                (this.authorIdFilter.length === 0 || this.authorIdFilter.includes(x.authorId)) &&
                (this.favoriteFilter === undefined || this.store.favorites.includes(x.id) === this.favoriteFilter)
            );
            this.$emit('articles:articleHits', this.articleHits);

            this.$emit('searchedWord:searchedWord', this.searchedWord);
        },
    },
    mounted() {
        if (this.initialSearchWord != "") {
            this.search(this.initialSearchWord);
        }
    },
    watch: {
        async initialSearchWord(newValue: string){
            console.log("NewVal: " + newValue);
            if (newValue == "") return;
            await this.search(newValue);
        }
    }
});
</script>