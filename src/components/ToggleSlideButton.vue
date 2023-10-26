<template>
    <main v-if="enableAudioClips">
        <label for="toggleThree"
            class="flex select-none items-center relative w-full cursor-pointer">
            <div class="justify-center mx-auto w-full">
                <div class="relative w-full">
                    <input type="checkbox" @click="onChange()" :checked="modelValue" value="" class="sr-only peer"
                        id="toggleThree" />
                    <div class="h-8 py-1 flex rounded-full bg-[#ACC0C5] shadow-lg items-center">
                        <p class="z-10 text-sm text-white font-semibold w-1/2 text-center" :class="{ 'text-white': modelValue }">
                            {{ $t('common.wisdomWords') }}
                        </p>
                        <p class="z-10 text-sm font-semibold w-1/2 text-white text-center" :class="{ 'text-white': modelValue }">
                            {{ $t('common.audioClips') }}
                        </p>
                    </div>

                    <div class="absolute items-center left-0 top-0 flex h-8 w-1/2 rounded-full bg-[#3D6E7C] transition peer-checked:bg-primary"
                        :class="{ 'translate-x-full': modelValue }"></div>
                </div>
            </div>
        </label>
    </main>
</template>
  
  
    
<script lang="ts">
import { enableAudioClips } from '@/services/env';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ToggleSlideButton",
    data() {
        return {
            chosen: 'Words',
            enableAudioClips: enableAudioClips,
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
    emits: ["update:modelValue", "change"],
    methods: {
        onChange() {
            this.$emit('update:modelValue', !this.modelValue);
            this.$emit('change');
            this.chosen = this.modelValue ? 'Words' : 'Audio'
        }
    },
});
</script>