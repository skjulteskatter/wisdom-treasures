<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="() => $emit('close')">
        <template #title> 
            <div class="flex">
                <p class="grow">Search</p>
                <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8" @click="() => $emit('close')">
					<XIcon class="h-8 opacity-50"/>
				</BaseButton>
            </div>
        </template>
            <BaseInput v-model="unusedModelValue" style-type="search" size="lg"
            @search-action="(_event: any) => $emit('searchAction', modelValue)"
            @input="(event: any) => $emit('update:modelValue', event.target?.value ?? '')"/>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"
import BaseInput from "./BaseInput.vue"

import { defineComponent } from "vue";
import { XIcon } from "@heroicons/vue/solid";
import BaseButton from "./BaseButton.vue";

export default defineComponent({
    name: "search-modal",
    components: {
        BaseModal,
        BaseInput,
        XIcon,
        BaseButton,
    },
    data: () => ({
        searchWord: "" as string,
        unusedModelValue: "" as string,
    }),
    emits: ["update:modelValue", "searchAction", "close"],
    props: {
        modelValue: {
            type: String,
        },
    },
});
</script>

<style>
</style>