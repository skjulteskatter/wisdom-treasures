<template>
	<nav class="shadow-md z-30 glass max-h-16">
		<div class="w-full bg-white/50">
			<div class="h-full max-w-7xl xl:mx-auto mx-3 flex min-h-[4rem]">
				<div id="leftNav" class="self-center flex gap-x-3">
					<img class="h-10 min-w-[2.5rem] cursor-pointer" src="/img/logo.svg" @click="navigate('dashboard')"/>
				</div>
				<div id="middleNav" class="self-center flex grow place-content-center gap-x-3 max-h-8">
					<BaseButton theme="menuButton" :clicked="$route.name === 'dashboard'" @click="navigate('dashboard')">Home</BaseButton>
					<BaseButton theme="menuButton" :clicked="$route.name === 'favorites'" @click="navigate('favorites')">Favorites</BaseButton>
					<BaseButton theme="menuButton" :clicked="$route.name === 'categories'" @click="navigate('categories')">Themes</BaseButton>
					<BaseButton theme="menuButton">History</BaseButton>

				</div>
				<div id="rightNav" class="self-center hidden gap-x-3 max-h-8 lg:flex">
					<BaseInput v-model="searchWord" placeholder="Search" style-type="search" class="self-center" @search-action="search($event)"/>
					<div v-if="currentUser !== null" class="flex gap-x-3 ml-2">
						<BaseButton theme="menuButton" size="small" class="self-center w-8 max-h-8">
							<QuestionMarkCircleIcon class="h-7 opacity-50"/>
						</BaseButton>
						<BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8">
							<BellIcon class="h-7 opacity-50"/>
						</BaseButton>
						<img :src="currentUser?.photoURL || '/public/img/user.svg'" class="w-8 h-8 rounded-full border-primary border cursor-pointer"/>
					</div>
					<div v-else class="flex gap-x-3">
						<BaseButton theme="tertiary" @click="navigate('login')" class="border border-primary"><b>Log in</b></BaseButton>
						<BaseButton theme="magic" @click="navigate('register')"><b>Sign up</b></BaseButton>
					</div>
				</div>
				<div id="rightNavBurger" class="self-center flex gap-x-3 max-h-8 lg:hidden">
					<HUMenu as="div" class="self-center flex">
						<MenuButton class="self-center">
							<MenuIcon class="w-7"/>
						</MenuButton>

						<transition
						enter-active-class="transition duration-100 ease-out"
						enter-from-class="transform scale-95 opacity-0"
						enter-to-class="transform scale-100 opacity-100"
						leave-active-class="transition duration-75 ease-in"
						leave-from-class="transform scale-100 opacity-100"
						leave-to-class="transform scale-95 opacity-0"
						>
						<MenuItems
							class="absolute right-0 mt-12 w-56 origin-top-right rounded-md dropDownGlass backdrop-blur-3xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
						> <!--TODO Find out how to add nested backdrop filters-->
							<div class="px-1 py-1">
							<MenuItem v-slot="{ active }">
								<button
								:class="[
									active ? 'bg-violet-500 text-white' : 'text-gray-900',
									'group flex w-full items-center rounded-md px-2 py-2 text-sm',
								]"
								>
								Edit
								</button>
							</MenuItem>
							<MenuItem v-slot="{ active }">
								<button
								:class="[
									active ? 'bg-violet-500 text-white' : 'text-gray-900',
									'group flex w-full items-center rounded-md px-2 py-2 text-sm',
								]"
								>
								<DuplicateIcon
									:active="active"
									class="mr-2 h-5 w-5 text-violet-400"
									aria-hidden="true"
								/>
								Duplicate
								</button>
							</MenuItem>
							</div>
							<div class="px-1 py-1">
							<MenuItem v-slot="{ active }">
								<button
								:class="[
									active ? 'bg-violet-500 text-white' : 'text-gray-900',
									'group flex w-full items-center rounded-md px-2 py-2 text-sm',
								]"
								>
								<ArchiveIcon
									:active="active"
									class="mr-2 h-5 w-5 text-violet-400"
									aria-hidden="true"
								/>
								Archive
								</button>
							</MenuItem>
							<MenuItem v-slot="{ active }">
								<button
								:class="[
									active ? 'bg-violet-500 text-white' : 'text-gray-900',
									'group flex w-full items-center rounded-md px-2 py-2 text-sm',
								]"
								>
								<MoveIcon
									:active="active"
									class="mr-2 h-5 w-5 text-violet-400"
									aria-hidden="true"
								/>
								Move
								</button>
							</MenuItem>
							</div>

						<div class="px-1 py-1">
							<MenuItem v-slot="{ active }">
								<button
								:class="[
									active ? 'bg-violet-500 text-white' : 'text-gray-900',
									'group flex w-full items-center rounded-md px-2 py-2 text-sm',
								]"
								>
								<DeleteIcon
									:active="active"
									class="mr-2 h-5 w-5 text-violet-400"
									aria-hidden="true"
								/>
								Delete
								</button>
							</MenuItem>
							</div>
						</MenuItems>
						
						</transition>
						
					</HUMenu>
				</div>
			</div>
		</div>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";
import router from "@/router";
import { useSessionStore } from "@/stores/session";
import { BellIcon, QuestionMarkCircleIcon, MenuIcon } from "@heroicons/vue/outline";
import { getCurrentUserPromise } from "@/services/auth";
import type { User } from "firebase/auth";
import breakpoints from "@/style/breakpoints";
import { Menu as HUMenu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

export default defineComponent({
	name: "the-navbar",
	components: {
	BaseInput,
	BaseButton,
	BellIcon,
	QuestionMarkCircleIcon,
	HUMenu,
	MenuButton,
	MenuItems,
	MenuItem,
	MenuIcon
},
	data: () => ({
		open: false,
		searchWord: "",
		currentUser: null as User | null,
		store: useSessionStore(),
		breakpoints: breakpoints,
	}),
	computed: {
		
	},
	async mounted() {
		this.currentUser = await getCurrentUserPromise();
	},
	methods: {
		search(searchWord : string){
			useSessionStore().searchWordBridge = searchWord;
			router.push({name: "search"});
		},
		navigate(name: string){
			if (name === "register"){
				this.store.loginFormBridge = "register";
				name = "login";
			}
			router.push({name: name});
		},
		test(){
			console.log(this.$route.name);
		}
	},
});
</script>

<style scoped>
.glass {
	background: (255, 255, 255, 0.1);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}

.dropDownGlass {
	background: rgba(255, 255, 255, 0.753);
	backdrop-filter: blur(15px);
	-webkit-backdrop-filter: blur(15px);
}
</style>