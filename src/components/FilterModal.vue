<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="closeWithReturnArrays">
        <div class="h-96 overflow-y-scroll">
            <div v-for="(publication, index) in allPublications" :key="index" class="flex">
                <label class="flex gap-2 ml-2 mt-2 items-center cursor-pointer select-none">
                    <BaseCheckbox v-model="publicationCheckBoxArray[index]" @vnode-mounted="()=>{if (!initialPublicationIds.includes(publication.id)){publicationCheckBoxArray[index] = false}}"/>
                    {{ publication.title }}
                </label>
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
        publicationCheckBoxArray: [] as boolean[],
    }),
    emits: ["close", "publicationIdArray:publicationIdArray", "contributorIdArray:contributorIdArray"],
    props: {
        initialPublicationIds: {
            type: Array<String>,
            default: [],
        },
        initialAuthorIds: {
            type: Array<String>,
            default: [],
        }
    },
    computed: {
        allAuthors() : Contributor[] {
            return []
            //TODO implement authors!
        },
        allPublications() : Publication[]{
            return Array.from(this.store.publications.values()).sort((a: Publication, b: Publication) => a.title.localeCompare(b.title));
        }
    },
    watch: {
        allPublications(newValue: Publication[]){
            while (this.publicationCheckBoxArray.length < newValue.length){
                this.publicationCheckBoxArray.push(false);
            }
        }
    },
    methods: {
        closeWithReturnArrays() {

            const returnArray : string[] = [];
            for (let i = 0; i < this.allPublications.length; i++) {
                if (this.publicationCheckBoxArray[i])
                    returnArray.push(this.allPublications[i].id);
            }
            this.$emit('publicationIdArray:publicationIdArray', returnArray);

            //TODO do the same thing as above but with authors

            this.$emit('close');
        },
    }
});
</script>

<style>
</style>