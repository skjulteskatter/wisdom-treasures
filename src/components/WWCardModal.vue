<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="() => $emit('close')">
        <template #default> 
            <div class="flex">
                <p class="grow">
                    <slot/>
                </p>
                <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8" @click="() => $emit('close')">
					<XIcon class="h-8 opacity-50"/>
				</BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"

import { defineComponent } from "vue";
import { XIcon } from "@heroicons/vue/solid";
import BaseButton from "./BaseButton.vue";

export default defineComponent({
    name: "base-modal",
    components: {
        BaseModal,
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