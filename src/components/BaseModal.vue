<template>
    <TransitionRoot
        as="template"
        :show="show"
    >
        <HUDialog as="div" class="glass" @close="closeModal">
            <TransitionChild
                as="template"
                enter="duration-200 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-100 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-black/50 z-40" />
            </TransitionChild>
            <TransitionChild
                as="template"
                enter="duration-200 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <BaseCard class="w-full md:w-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                    <template #header v-if="$slots.title || $slots.description || $slots.icon">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <slot name="icon" />
                            <div class="w-full">
                                <DialogTitle>
                                    <slot name="title" />
                                </DialogTitle>
                                <DialogDescription>
                                    <slot name="description" />
                                </DialogDescription>
                            </div>
                        </div>
                    </template>
                    <slot name="default" />
                    <template #footer v-if="$slots.footer">
                        <slot name="footer" />
                    </template>
                </BaseCard>
            </TransitionChild>
        </HUDialog>
    </TransitionRoot>
</template>

<script lang="ts">

import { 
    TransitionRoot, 
    TransitionChild,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
    Dialog as HUDialog,
} from "@headlessui/vue";
import BaseCard from "./BaseCard.vue";

import { defineComponent } from "vue";

export default defineComponent({
    name: "base-modal",
    components: {
        TransitionRoot,
        TransitionChild,
        HUDialog,
        DialogOverlay,
        DialogTitle,
        DialogDescription,
        BaseCard
    },
    props: {
        show: {
            type: Boolean,
        },
    },
    emits: ["close"],
    methods: {
        closeModal() {
            this.$emit("close");
        },
    },
});
</script>

<style>
.glass {
	background: (255, 255, 255, 0.1);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}
</style>