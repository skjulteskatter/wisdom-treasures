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
            <BaseInput v-model="store.searchWord" placeholder="Search..." :white-text="true" style-type="search" size="lg"
            @search-action="(_event: any) => $emit('searchAction', modelValue)"
            @input="(event: any) => $emit('update:modelValue', event.target?.value ?? '')"/>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"
import BaseInput from "./BaseInput.vue"
import BackButton from '@/components/BackButton.vue';
import { defineComponent } from "vue";
import { XIcon } from "@heroicons/vue/solid";
import BaseButton from "./BaseButton.vue";
import { useSessionStore } from "@/stores/session";

export default defineComponent({
    name: "search-modal",
    components: {
        BaseModal,
        BaseInput,
        XIcon,
        BaseButton,
        BackButton
    },
    data: () => ({
        store: useSessionStore()
    }),
    emits: ["update:modelValue", "searchAction", "close"],
    props: {
        modelValue: {
            type: String,
        },
    },
});
</script>