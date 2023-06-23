<template>
    <main>
        <label for="toggleThree"
            class="flex select-none items-center relative inline-flex w-full items-center cursor-pointer">
            <div class="justify-center mx-auto w-full">
                <div class="relative w-full">
                    <input type="checkbox" @click="onChange()" :checked="modelValue" value="" class="sr-only peer"
                        id="toggleThree" />
                    <div class="block h-8 py-1 flex rounded-full bg-[#ACC0C5] shadow-lg">
                        <p class="z-10 text-white font-semibold w-1/2 text-center" :class="{ 'text-primary': modelValue }">
                            Wisdomwords
                        </p>
                        <p class="z-10 font-semibold w-1/2 text-primary text-center" :class="{ 'text-white': modelValue }">
                            Audio
                        </p>
                    </div>

                    <div class="dot absolute items-center left-0 top-0 flex h-8 w-1/2 rounded-full bg-[#3D6E7C] transition peer-checked:bg-primary"
                        :class="{ 'translate-x-full': modelValue }"></div>
                </div>
            </div>
        </label>
    </main>
</template>
  
  
    
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ToggleSlideButton",
    data() {
        return {
            chosen: 'Words'
        }
    },
    props: {
        label: {
            type: String,
            required: false,
            default: undefined,
        },
        modelValue: {
            type: Boolean,
        },
    },
    emits: ["update:modelValue"],
    methods: {
        onChange() {
            console.log(this.modelValue)
            this.$emit('update:modelValue', !this.modelValue);
            this.chosen = this.modelValue ? 'Words' : 'Audio'
        }
    },
});
</script>