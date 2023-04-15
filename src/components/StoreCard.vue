<template>
    <BaseCard class="border-2 hover:border-black/30 border-black/0 cursor-pointer bg-secondary flex" @click ="() => {$emit('click')}">
        <template #header>
          <div class="text-2xl font-sans">
            <slot name="header">
            </slot>
          </div>
        </template>
        <template #default>
          <div>
            <slot name="default">
            </slot>
          </div>
        </template>
    </BaseCard>
</template>

<script lang="ts">

import BaseModal from "./BaseModal.vue"

import { defineComponent } from "vue";
import { useSessionStore } from "@/stores/session";
import { uuid } from 'vue-uuid';
import WWShowCard from "./WWShowCard.vue";
import BaseCard from "./BaseCard.vue";

export default defineComponent({
    name: "storecard",
    components: {
        BaseModal,
        WWShowCard,
        BaseCard,
    },
    data: () => ({
        store: useSessionStore(),
        copyToClipBoardKey: uuid.v4() as string,
        openCopyToClipBoardPopUpSemaphore: 0 as number,
    }),
    emits: ["click"],
    computed: {
    },
    watch: {
    },
    methods: {
    },
});
</script>