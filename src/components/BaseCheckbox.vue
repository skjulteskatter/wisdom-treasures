<template>
    <input @click="onChange()" type="checkbox" :checked="modelValue" class="rounded border border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-primary" :class="modelValue && hasBeenClicked ? 'checkBoxChecked' : ''"/>
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
        }
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
.checkBoxChecked{
  animation: checkBoxChecked 0.25s both linear;
}

@keyframes checkBoxChecked {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>