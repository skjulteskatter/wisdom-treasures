<template>
        <TransitionRoot
            as="template"
            :show="show"
        >
            <HUDialog as="section">
                <TransitionChild
                    as="template"
                    enter="duration-200 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-100 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <DialogOverlay class="fixed inset-0 bg-black/50 glass"/>
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
                <div class="fixed w-full flex flex-col h-full">
                    <div id="clickOutsideDetector" class="fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" @click="e => $emit('close', e)"/>
                    <div class="grow basis-0">
                        <BaseButton theme="menuButton" size="small" class="m-4 w-10 max-h-10 block sm:hidden z-30" @click="e => $emit('close', e)">
                            <ArrowLeftIcon class="h-10 grayscale brightness-[3.5]"/>
                        </BaseButton>
                    </div>
                    <BaseCard v-if="useBaseCard" class="w-11/12 md:w-auto self-center z-30">
                        <template #header v-if="$slots.title || $slots.description || $slots.icon">
                            <div class="flex flex-col sm:flex-row gap-4">
                                <slot name="icon"/>
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
                    <div v-else class="w-11/12 md:w-auto self-center z-30">
                        <slot/>
                    </div>
                    <div id="JustForSpacing" class="grow basis-0"/>
                </div>
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
import { useSessionStore } from "@/stores/session";
import BaseButton from "./BaseButton.vue";
import { ArrowLeftIcon } from "@heroicons/vue/outline";

export default defineComponent({
    name: "base-modal",
    components: {
        TransitionRoot,
        TransitionChild,
        HUDialog,
        DialogOverlay,
        DialogTitle,
        DialogDescription,
        BaseCard,
        BaseButton,
        ArrowLeftIcon
    },
    data() {
       return {
         store: useSessionStore(),
       }
    },
    mounted() {
    },
    props: {
        show: {
            type: Boolean,
        },
        useBaseCard: {
            type: Boolean,
            default: true,
        },
    },
    emits: ["close"],
    computed: {
        globalCloseModalEvent() {
          return this.store.globalCloseModal;
        }
    },
    watch: {
        globalCloseModalEvent(){
            if (this.show) this.$emit('close');
        }
    },
});
</script>