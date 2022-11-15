<template>
    <label class="border-none p-0 bg-transparent">
        <div class="flex justify-between" :class="[error ? 'text-[color:var(--wt-color-error)]' : '', $slots.default || $slots.secondary ? 'mb-2' : '']">
            <slot name="default" class="block tracking-wide"></slot>
            <slot name="secondary" class="block tracking-wide"></slot>
        </div>
        <div 
            class="flex items-center" 
            :class="[error ? 'shake' : '']"
            @mouseover="hover = true"
            @mouseleave="hover = false"
            >
            <div v-if="styleType == 'search'">
                <div class="w-5 absolute left-2 -top-[0.61rem] cursor-pointer z-40 opacity-40" @click="(event: any) => $emit('searchAction', modelValue)">
                    <SearchIcon/>
                </div>
            </div>
            <input
                @focusin="focus = true"
                @focusout="focus = false"
                :type="getType"
                class="px-2 py-1 rounded-md border-black/20 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full text-base"
                :class="[error ? ' focus-visible:border-[color:var(--wt-color-error)] focus-visible:ring-[color:var(--wt-color-error)] border-[color:var(--wt-color-error)]' : ' focus-visible:border-primary focus-visible:ring-primary', styleType === 'search' ? 'pl-8 pr-8 bg-black/10 border-0' : '', styleType === 'password' ? 'pr-8' : '']"
                :value="modelValue"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="(event: any) => $emit('update:modelValue', event.target?.value ?? '')"
            />
            <div v-if="modelValue && styleType == 'password'">
                <div class="w-5 absolute -left-7 -top-[0.61rem] cursor-pointer" @click="showPassword = !showPassword">
                    <EyeIcon v-if="!showPassword"></EyeIcon>
                    <EyeOffIcon v-else></EyeOffIcon>
                </div>
            </div>
            <div v-else-if="modelValue && (focus || hover) && styleType == 'search'">
                <div 
                class="w-5 absolute -left-7 -top-[0.61rem] cursor-pointer opacity-40" 
                @click="(event: any) => $emit('update:modelValue', '')"
                >
                    <XIcon/>
                </div>
            </div>
        </div>
    </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EyeIcon, EyeOffIcon, SearchIcon, XIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "base-input",
    components: {
        EyeIcon,
        EyeOffIcon,
        SearchIcon,
        XIcon,
    },
    data() {
        return {
            showPassword: false,
            hover: false as Boolean,
            focus: false as Boolean,
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
        styleType: {
            type: String,
            //validator: (propValue: string | undefined) => ["default", "password", "search"].includes(propValue + "") || !propValue,
            default: "default",
        },
        error:{
            type: Boolean,
        },
    },
    emits: ["update:modelValue", "searchAction"],
    computed: {
        getType(): string{
            return this.styleType === "password" && !this.showPassword ? "password" : "text";
        },
    },
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
        transform: translate3d(-1px, 0, 0);
    }   
    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }   
    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }   
    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}

</style>