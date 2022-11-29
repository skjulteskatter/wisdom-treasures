<template>
    <input @click="onChange()" type="checkbox" :checked="modelValue" class="rounded border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" 
    :class="[modelValue && hasBeenClicked ? 'pop' : '', error ? 'shake' : 'border-black/20 text-primary ring-primary focus-visible:ring-primary']"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "base-checkbox",
    components: {
    },
    data: () => ({
		hasBeenClicked: false,
	}),
    props: {
        modelValue: {
            type: Boolean,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        error:{
            type: Boolean,
        },
    },
    emits: ["update:modelValue"],
    methods:{
        onChange(){
            this.hasBeenClicked = true;
            this.$emit('update:modelValue', !this.modelValue);
        }
    }
});
</script>

<style>
.shake{
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    border-color: var(--wt-color-error) !important;
}

@keyframes shake {
    10%,
    90% {
        transform: translate3d(-0.5px, 0, 0);
    }   
    20%,
    80% {
        transform: translate3d(1px, 0, 0);
    }   
    30%,
    50%,
    70% {
        transform: translate3d(-2px, 0, 0);
    }   
    40%,
    60% {
        transform: translate3d(2px, 0, 0);
    }
}

</style>