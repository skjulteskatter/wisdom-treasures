<template>
  <main class="mt-4">
    <BaseButton theme="menuButton" @click="$router.back()">
        <template #default>
            <div class="text-lg">Back</div>
        </template>
        <template #firstIcon>
            <ArrowLeftIcon class="h-5"/>
        </template>
    </BaseButton>
    <BaseCard class="bg-primary text-white mt-4">
        <template #header> 
            <div class="">
                <div v-if="searchedWord">
                    Showing {{numberOfResults}} Results for "{{searchedWord}}"
                </div>
                <div v-else>
                    Search
                </div>
            </div>
        </template>
            <BaseInput v-model="searchWord" style-type="search" size="lg" @search-action="search($event)">
            </BaseInput>
        <template>
            
        </template>
    </BaseCard>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseCard from '@/components/BaseCard.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { useSessionStore } from '@/stores/session';
import { ArrowLeftIcon } from '@heroicons/vue/solid';

  export default defineComponent({
    name: "SearchView",
    data() {
        return {
            searchWord: "" as string,
            numberOfResults: 0 as number,
            searchedWord: "" as string,
            store: useSessionStore(),
        }
    },
    props: {
    },
    components: {
        BaseCard,
        BaseInput,
        BaseButton,
        ArrowLeftIcon,
    },
    computed: {
        searchWordBridge(){
            return this.store.searchWordBridge;
        }
    },
    watch : {
        searchWordBridge(newValue: string){
            if (newValue.length > 0){
                this.search(newValue);
                this.store.searchWordBridge = "";
            }
        },
    },
    mounted() {
        this.searchedWord = this.searchWordBridge;
        if (this.searchedWord.length > 0){
            this.store.searchWordBridge = "";
            this.search(this.searchedWord);
        }

    },
    methods: {
        async search(searchWord: string) {
            this.searchedWord = searchWord;
            // TODO do the actual searching
            console.log("Searched for word: " + searchWord);
        },
    }
  });
</script>

<style>
</style>