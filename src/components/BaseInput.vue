<template>
    <label class="border-none p-0 bg-transparent">
        <div class="flex justify-between">
            <div :class="[error ? 'text-[color:var(--wt-color-error)]' : '']">
                <slot name="default" class="block tracking-wide"></slot>
            </div>
            <slot name="secondary" class="block tracking-wide"></slot>
        </div>
        <div class="flex items-center">
            <input
                :type="getType"
                class="px-2 py-1 text-base rounded-md border-black/20 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full"
                :class="[error ? 'focus-visible:ring-[color:var(--wt-color-error)] border-[color:var(--wt-color-error)]' : '']"
                v-bind="$attrs"
                :value="modelValue"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="(event: any) => $emit('update:modelValue', event.target?.value ?? '')"
            />
            <div v-if="modelValue && password">
                <div class="w-5 absolute -left-7 -top-[0.35rem] cursor-pointer z-10" @click="showPassword = !showPassword" >
                    <EyeIcon v-if="!showPassword"></EyeIcon>
                    <EyeOffIcon v-else></EyeOffIcon>
                </div>
            </div>
        </div>
    </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EyeIcon, EyeOffIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "base-input",
    components: {
        EyeIcon,
        EyeOffIcon,
    },
    data() {
        return {
            showPassword: false,
        }
    },
    props: {
        modelValue: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
        },
        password: {
            type: Boolean,
        },
        error:{
            type: Boolean,
        }
    },
    emits: ["update:modelValue"],
    computed: {
        getType(): string{
            return this.password && !this.showPassword ? "password" : "text";
        },
    },
});
</script>
