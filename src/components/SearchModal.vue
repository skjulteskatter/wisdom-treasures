<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40">
        <template #title> 
            Search
        </template>
            <BaseInput v-model="searchWord" style-type="search" size="lg" @search-action="search($event)"/>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"
import BaseInput from "./BaseInput.vue"
import BaseCard from "./BaseCard.vue"

import { defineComponent } from "vue";

export default defineComponent({
    name: "base-modal",
    components: {
        BaseModal,
        BaseInput,
    },
    data: () => ({
        searchWord: "" as string,
    }),
    methods: {
        search(searchWord: string){
            console.log("You searched for: " + searchWord + " In the modal");
        }
    }
});
</script>

<style>
</style>