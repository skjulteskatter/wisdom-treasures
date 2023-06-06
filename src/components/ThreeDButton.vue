<template>
    <main>
        <BaseButton @click="clicked" :threeD="true" :loading="loading" :loadingLabel="loadingLabel" class="w-[calc(100%-2px)] h-[calc(100%-4px)] absolute top-1 left-[2px]" theme="primary">
            <template #default>
                <slot/>
            </template>
            <template v-if="$slots.icon" #firstIcon>
                <slot name="firstIcon"/>
            </template>
            <template v-if="$slots.icon" #icon>
                <slot name="icon"/>
            </template>
        </BaseButton>
        <!-- <div id="buttonBackground" class="overflow-hidden bg-primary brightness-50 w-[calc(100%-2px)] h-[calc(100%-4px)] ml-[1px] mt-1 absolute rounded-md top-0"/> -->
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from './BaseButton.vue';

export default defineComponent({
    name: "Three-d-button",
    components: {
        BaseButton
    },
    emits: ["clicked"],
    methods: {
        clicked(){
            this.$emit('clicked');
        }
    },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        loadingLabel: {
            type: String,
            default: "Loading...",
        }
    },
});
</script>
