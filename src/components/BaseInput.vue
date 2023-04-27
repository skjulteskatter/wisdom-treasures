<template>
    <label class="border-none p-0 bg-transparent w-full">
        <div class="flex justify-between" :class="[error ? 'text-[color:var(--wt-color-error)]' : '', $slots.default || $slots.secondary ? 'mb-2' : '']">
            <slot name="default" class="block tracking-wide"></slot>
            <slot name="secondary" class="block tracking-wide"></slot>
        </div> 
        <div 
            class="flex items-center w-full"
            :class="[error ? 'shake' : '']"
            @mouseover="hover = true"
            @mouseleave="hover = false"
            >
            <component :is="insideHUMenu ? 'MenuItem' : 'div'" as="div">
                <div v-if="styleType == 'search'" class="w-6 absolute left-2.5 -top-[11px] cursor-pointer z-40" @click="(_event: any) => search()">
                    <SearchIcon class="text-white/90"/>
                </div>
            </component>
            <input
                @focusin="focus = true"
                @focusout="focus = false"
                @keyup.enter ="(_event: any) => search()"
                :type="getType"
                class="px-2 py-3 rounded-md border-black/20 placeholder-white/90 tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full text-base"
                :class="[error ? ' focus-visible:border-[color:var(--wt-color-error)] focus-visible:ring-[color:var(--wt-color-error)] border-[color:var(--wt-color-error)]' : ' focus-visible:border-primary focus-visible:ring-primary', 
                    styleType === 'search' ? ['pl-11 pr-10 bg-black/10 border-0'] : '', 
                    styleType === 'password' ? 'pr-8' : '',
                    size === 'lg' ? 'text-xl' : '',]"
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
        <HUMenu v-if="getSearchHistory.length > 0 && (focus || searchHistoryHoverOver) && !insideHUMenu && styleType === 'search'" as="div" class="self-center flex z-20" @mouseover="searchHistoryHoverOver = true" @mouseleave="searchHistoryHoverOver = false">
			<MenuItems static
				class="absolute w-11/12 top-1 sm:w-56 sm:origin-top-right rounded-md glassDropDown shadow-xl ring-1 ring-black ring-opacity-20 focus:outline-none overflow-hidden">
				<div class="flex flex-col p-1">
					<MenuItem v-for="searchTerm in getSearchHistory" v-bind:key="searchTerm">
						<BaseButton theme="menuButton" :center-text="false" @click="searchTermClicked(searchTerm)">{{searchTerm}}</BaseButton>
					</MenuItem>
				</div>
			</MenuItems>
		</HUMenu>
    </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EyeIcon, EyeOffIcon, SearchIcon, XIcon } from "@heroicons/vue/solid";
import { Menu as HUMenu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { search } from '@/services/localStorage';
import BaseButton from './BaseButton.vue';

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
        MenuItem,
        HUMenu,
        MenuButton,
        MenuItems,
        BaseButton,
    },
    data() {
        return {
            showPassword: false,
            hover: false as Boolean,
            focus: false as Boolean,
            searchHistory: [] as string[],
            searchHistoryHoverOver: false as Boolean,
            placeholder: 'Search...'
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
        },
    },
    emits: ["update:modelValue", "searchAction"],
    computed: {
        getType(): string{
            return this.styleType === StyleTypeEnum.password && !this.showPassword ? "password" : "text";
        },
        getSearchHistory() : string[]{
            const history : string[] = [];
            for (const [key, value] of search.getAll()) {
                if (this.modelValue == "" || ((key !== undefined && key.startsWith(this.modelValue ?? "⛄") && key != this.modelValue)))
                history.push(key);
            }
            return history;
        }
    },
    methods: {
        search(searchTerm?: string) {
            if (searchTerm === undefined) searchTerm = this.modelValue;
            if (searchTerm !== undefined && searchTerm !== null && searchTerm.replace(/(\s)/g, "") !== "") {
                search.addOrReplace(searchTerm, Date.now());
            }
            
            this.$emit('searchAction', searchTerm);
        },
        searchTermClicked(searchTerm: string) {
            this.$emit('update:modelValue', searchTerm);
            this.search(searchTerm);
            this.searchHistoryHoverOver = false;
        }
    },
});
</script>

<style scoped>

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

.glassDropDown {
	background: (255, 255, 255, 0.1);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}
.glassDropDown > div {
	background: rgba(255, 255, 255, 0.8);
}

</style>