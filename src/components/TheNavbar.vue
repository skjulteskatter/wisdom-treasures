<template>
	<nav class="shadow-md z-10 max-h-16">
		<div id = "glassEffect" class="absolute glass w-full h-full"/>
		<div class="w-full bg-white/50">
			<div class="h-full max-w-7xl xl:mx-auto mx-3 flex min-h-[4rem]">
				<div id="leftNav" class="self-center flex gap-x-3">
					<img class="h-10 min-w-[2.5rem] cursor-pointer" src="/img/logo.svg" @click="navigate('dashboard')"/>
				</div>
				<div id="middleNav" class="self-center flex grow place-content-center gap-x-3 max-h-8">
					<BaseButton theme="menuButton" :clicked="$route.name === 'dashboard'" @click="navigate('dashboard')">Home</BaseButton>
					<BaseButton theme="menuButton" :clicked="$route.name === 'favorites'" @click="navigate('favorites')">Favorites</BaseButton>
					<BaseButton theme="menuButton" :clicked="$route.name === 'categories'" @click="navigate('categories')">Themes</BaseButton>
					<BaseButton theme="menuButton" :clicked="$route.name === 'history'" @click="navigate('history')">History</BaseButton>

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
				<div id="rightNavBurger" class="self-center flex gap-x-3 max-h-8 lg:hidden z-20">
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
							class="absolute right-0 origin-bottom-right bottom-12 sm:bottom-auto sm:top-12 sm:origin-top-right w-56 rounded-md glassDropDown shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							<div class="px-1 py-1 rounded-t-md flex flex-col sm:hidden">
								<MenuItem>
									<BaseButton theme="menuButton" :center-text="false" :clicked="$route.name === 'dashboard'" @click="navigate('dashboard')">Home</BaseButton>
								</MenuItem>
								<MenuItem>
									<BaseButton theme="menuButton" :center-text="false" :clicked="$route.name === 'favorites'" @click="navigate('favorites')">Favorites</BaseButton>
								</MenuItem>
								<MenuItem>
									<BaseButton theme="menuButton" :center-text="false" :clicked="$route.name === 'categories'" @click="navigate('categories')">Themes</BaseButton>
								</MenuItem>
								<MenuItem>
									<BaseButton theme="menuButton" :center-text="false" :clicked="$route.name === 'history'" @click="navigate('history')">History</BaseButton>
								</MenuItem>
							</div>
							<div class="px-1 py-1 rounded-t-none sm:rounded-t-md flex">
								<BaseInput :inside-h-u-menu="true" v-model="searchWord" placeholder="Search" style-type="search" class="self-center" @search-action="search($event)" @keydown.enter="search(undefined)"/>
							</div>

							<div class="px-1 py-1 rounded-b-md">
								<MenuItem>
									<div class="flex gap-2 max-h-8">
										<BaseButton theme="tertiary" @click="navigate('login')" class="border grow border-primary"><b>Log in</b></BaseButton>
										<BaseButton theme="magic" @click="navigate('register')" class="grow"><b>Sign up</b></BaseButton>
									</div>
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
		search(searchWord : string | undefined){
			if (searchWord === undefined) searchWord = this.searchWord;
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

.glassDropDown {
	background: (255, 255, 255, 0.1);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}
.glassDropDown > div {
	background: rgba(255, 255, 255, 0.5);
}
</style>