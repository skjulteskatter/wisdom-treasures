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
            <component :is="insideHUMenu ? 'MenuItem' : 'div'" as="div">
                <div v-if="styleType == 'search'" class="w-5 absolute left-2 -top-[10px] cursor-pointer z-40 opacity-40" @click="(_event: any) => search()">
                    <SearchIcon/>
                </div>
            </component>
            <input
                @focusin="focus = true"
                @focusout="focus = false"
                @keyup.enter ="(_event: any) => search()"
                :type="getType"
                class="px-2 py-1 rounded-md border-black/20 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full text-base"
                :class="[error ? ' focus-visible:border-[color:var(--wt-color-error)] focus-visible:ring-[color:var(--wt-color-error)] border-[color:var(--wt-color-error)]' : ' focus-visible:border-primary focus-visible:ring-primary', 
                    styleType === 'search' ? ['pl-8 pr-8 bg-black/10 border-0'] : '', 
                    styleType === 'password' ? 'pr-8' : '',
                    size === 'lg' ? 'text-2xl' : '',]"
                :value="modelValue"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="(event: any) => $emit('update:modelValue', event.target?.value ?? '')"
            />
            <div v-if="modelValue && styleType === 'password'">
                <div class="w-5 absolute -left-7 -top-[10px] cursor-pointer" @click="showPassword = !showPassword">
                    <EyeIcon v-if="!showPassword"></EyeIcon>
                    <EyeOffIcon v-else></EyeOffIcon>
                </div>
            </div>
            <div v-else-if="modelValue && (focus || hover) && styleType === 'search'">
                <div 
                class="w-5 absolute -left-7 -top-[10px] cursor-pointer opacity-40" 
                @click="(_event: any) => $emit('update:modelValue', '')"
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
import { MenuItem } from '@headlessui/vue';
import { search } from '@/services/localStorage';

export enum SizeEnum {
    lg = "lg", md = "md"
}

export enum StyleTypeEnum {
    default = "default", password = "password", search = "search"
}

export default defineComponent({
    name: "base-input",
    components: {
        EyeIcon,
        EyeOffIcon,
        SearchIcon,
        XIcon,
        MenuItem
    },
    data() {
        return {
            showPassword: false,
            hover: false as Boolean,
            focus: false as Boolean,
            searchHistory: [] as string[],
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
            default: StyleTypeEnum.default,
        },
        error:{
            type: Boolean,
        },
        size: {
            type: String,
            default: SizeEnum.md,
        },
        insideHUMenu: {
            type: Boolean,
            default: false,
        }
    },
    emits: ["update:modelValue", "searchAction"],
    computed: {
        getType(): string{
            return this.styleType === StyleTypeEnum.password && !this.showPassword ? "password" : "text";
        },
        getSearchHistory() : string[]{
            const history : string[] = [];
            for (const [key, value] of search.getAll()) {
                history.push(key);
            }
            return history;
        }
    },
    methods: {
        search() {
            if (this.modelValue !== undefined && this.modelValue !== null && this.modelValue.replace(/(\s)/g, "") !== "") {
                search.addOrReplace(this.modelValue, Date.now());
            }
            
            this.$emit('searchAction', this.modelValue);
        }
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