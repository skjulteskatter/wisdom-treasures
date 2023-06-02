<template>
    <Menu as="div" class="z-40 opacity-80">
        <MenuButton class="w-full h-full px-2 py-1 rounded-md border-black/20 border" :class="profileLanguage ? 'border-l-white/0 border-r-white/0 sm:border-t-white/0 py-3 rounded-none' : ''">
            <div class="flex place-content-center gap-2 place-items-center">
                {{ chosenValue ?? initialValue }}
                <ChevronDownIcon class="h-5 opacity-80"></ChevronDownIcon>
            </div>
        </MenuButton>
        <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >

        <MenuItems class="absolute right-0 mt-2 origin-top-right divide-y rounded-md glassDropDown shadow-xl ring-1 ring-black ring-opacity-20 focus:outline-none overflow-hidden">
			<div class="flex flex-col p-1">
				<MenuItem v-for="value in inputMap" v-bind:key="value[0]">
					<BaseButton class="w-full" theme="menuButton" :center-text="false" @click="clickedValue(value)">{{ value[1] }}</BaseButton>
				</MenuItem>
			</div>
		</MenuItems>
      </transition>
    </Menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/outline';
import BaseButton from './BaseButton.vue';
export default defineComponent({
    name: "GenerelDropDown",
    components: {
        Menu,
        MenuButton,
        MenuItems,
        MenuItem,
        ChevronDownIcon,
        BaseButton,
    },
    data: () => ({
        chosenValue: null as string | null,
    }),
    props: {
        initialValue: {
            type: String,
            required: true
        },
        inputMap: {
            type: Map<string, string>,
            required: true
        },
        profileLanguage: {
            type: Boolean,
            default: false
        }
    },
    emits: ["valueClicked:chosenValue"],
    computed: {

    },
    methods: {
        clickedValue(value: [string, string]) {
            this.chosenValue = value[1];
            this.$emit('valueClicked:chosenValue', value[0]);
        }
    },
});
</script>

<style scoped>

.glassDropDown {
	background: (255, 255, 255, 0.1);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}
.glassDropDown > div {
	background: rgba(255, 255, 255, 0.5);
}
</style>