<template>
    <div class="text-primary hover:text-[color:var(--color-text)] cursor-pointer" 
    tabindex="0" v-on:click="clickEvent()" v-on:keydown.space="clickEvent()" v-on:keydown.enter="clickEvent()">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ClickableLink",
    methods: {
        clickEvent(){
            this.$emit('link-clicked');
        }
    },
    emits: ['link-clicked']
});
</script>
