<template>
    <div :class="{'text-primary hover:text-[color:var(--color-text)] cursor-pointer' : !disabled, 'text-black/30 cursor-not-allowed' : disabled}" 
    tabindex="0" v-on:click="clickEvent()" v-on:keydown.space="clickEvent()" v-on:keydown.enter="clickEvent()" class="select-none">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ClickableLink",
    methods: {
        clickEvent(){
            if (this.disabled) return;
            this.$emit('link-clicked');
        }
    },
    emits: ['link-clicked'],
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    }
});
</script>
