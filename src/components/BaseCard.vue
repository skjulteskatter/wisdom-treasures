<template>
    <div class="rounded-lg shadow-md flex flex-col" :class="[glass ? 'glass bg-white/50' : 'bg-white']">
        <div class="px-4 py-3 border-b border-black/10 font-serif text-2xl" v-if="$slots.header">
            <slot name="header" />
        </div>
        <div class="p-4 flex-grow" v-if="$slots.default">
            <slot name="default" />
        </div>
        <div class="px-4 py-3 border-t border-black/10" v-if="$slots.footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "BaseCard",
    props: {
        glass: {
            type: Boolean,
            default: false,
        },
    }
});
</script>
