<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="() => $emit('close')">
        <div class="h-4/5">
            <div v-for="(publication, index) in allPublications" :key="index" class="flex">
                <BaseCheckbox></BaseCheckbox>
                {{ publication.title }}
            </div>
        </div>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"
import BaseCheckbox from "./BaseCheckbox.vue";
import { defineComponent } from "vue";
import type { Contributor, Publication } from "hiddentreasures-js";
import { useSessionStore } from "@/stores/session";

export default defineComponent({
    name: "filter-modal",
    components: {
    BaseModal,
    BaseCheckbox
},
    data: () => ({
        store: useSessionStore(),
    }),
    emits: ["close"],
    computed: {
        allPublications() : Publication[] {
            return Array.from(this.store.publications.values());
        },
        allAuthors() : Contributor[] {
            return []
            //TODO implement authors!
        },
    }
});
</script>

<style>
</style>