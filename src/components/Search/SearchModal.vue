<template>
    <BaseModal :show="true" :forSearchModal="true" class="fixed w-full h-full left-0 top-0 z-40" @close="() => $emit('close')">
        <template #title> 
            <div class="flex justify-between items-center w-full h-full mt-4">
                <BackButton/>
                <h1 class="font-bold tracking-wide text-base self-center">Search</h1>
                <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8 mr-2 ml-2" @click="() => $emit('close')">
					<XIcon class="h-5 text-white"/>
				</BaseButton>
            </div>
        </template>
        <div class="flex justify-between items-center w-full h-full mt-4">
            <BaseInput v-model="store.searchWord" style-type="search" class="sm:hidden grow" size="" :whiteText="true" :forMultiSearch="true" placeholder="Search..." @search-action="search()"/>
            <BaseInput v-model="store.searchWord" style-type="search" class="hidden sm:block grow" size="" :forMultiSearch="true" placeholder="Search..." @search-action="search()"/>
            <BaseButton theme="menuButton" class="flex h-min w-min" @click="showFilterModal = !showFilterModal" :forMultiSearch="true" :whiteText="true">
                <template #icon>
                    <AdjustmentsIcon class="w-4"/>
                </template>
            </BaseButton>
        </div>
        <FilterModal
                class="text-black"
                ref="filterModalRef"
                :show="showFilterModal"/>
        <FilterButtonGroup :for-search-modal="true"/>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "../BaseModal.vue"
import BaseInput from "../BaseInput.vue"
import BackButton from '@/components/BackButton.vue';
import { defineComponent } from "vue";
import { XIcon, AdjustmentsIcon } from "@heroicons/vue/outline";
import BaseButton from "../BaseButton.vue";
import { useSessionStore } from "@/stores/session";
import FilterModal from "./FilterModal.vue";
import FilterButtonGroup from "./FilterButtonGroup.vue";


export default defineComponent({
    name: "search-modal",
    components: {
        BaseModal,
        BaseInput,
        XIcon,
        BaseButton,
        BackButton,
        FilterModal,
        AdjustmentsIcon,
        FilterButtonGroup,
    },
    data: () => ({
        store: useSessionStore(),
        showFilterModal: false as boolean,
    }),
    methods:{
        search(){
            this.$emit('searchAction', this.store.searchWord);
        }
    },
    emits: ["searchAction", "close"],
});
</script>