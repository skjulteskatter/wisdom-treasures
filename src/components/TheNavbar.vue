<template>
	<nav class="shadow-md z-50 max-h-16 sm:max-h-16" @mouseup="store.globalCloseModal = !store.globalCloseModal">
		<div id = "glassEffect" class="absolute glass w-full h-full"/>
		<div class="w-full bg-white">
			<div class="h-full max-w-7xl xl:mx-auto mx-3 flex sm:flex-row min-h-[4rem] flex-row-reverse justify-around sm:justify-start px-8 border-t border-[color:var(--wt-color-ui-lm-dark)]">
				<div id="leftNav" class="self-center flex gap-x-3">
					<img class="h-8 min-w-[2.5rem] cursor-pointer hidden sm:block" src="/img/logo.svg" @click="navigate('dashboard')"/>
					<div class="flex sm:hidden self-center place-content-center cursor-pointer">
						<SearchIcon class="w-6 text-[color:var(--wt-color-text-grey)]" @click="showSearchModal = true"/>
						<SearchModal :show="showSearchModal" v-model="searchWord" @search-action="{showSearchModal = false; search($event)}" @close="showSearchModal = false"/>
					</div>
				</div>
				<div id="middleNav" class="sm:flex self-center hidden grow place-content-left gap-x-3 max-h-8 pl-6">
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('dashboard')" @click="(e: Event | undefined) => navigate('dashboard', e)">{{$t('common.home')}}</BaseButton>
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('favorites')" @click="(e: Event | undefined) => navigate('favorites', e)">{{$t('common.favorites')}}</BaseButton>
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('themesIndex')" @click="navigate('themes')">{{$t('common.themes')}}</BaseButton>
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('history')" @click="navigate('history')">{{$t('common.history')}}</BaseButton>
					<!--<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('manna')" @click="navigate('manna')">Manna</BaseButton>-->
				</div>
				<div class="flex sm:hidden self-center place-content-center cursor-pointer" @click="navigate('dashboard')">
					<HomeIcon class="w-6 text-[color:var(--wt-color-text-grey)]"/>
				</div>
				<div id="rightNav" class="self-center hidden gap-x-3 max-h-8 lg:flex">
					<BaseInput v-model="searchWord" :placeholder="$t('common.search')" style-type="search" class="self-center" @search-action="search($event)"/>
					<div v-if="currentUser !== null" class="flex gap-x-3 ml-2">
						<BaseButton theme="menuButton" size="small" class="self-center w-8 max-h-8">
							<QuestionMarkCircleIcon class="h-6 opacity-50"/>
						</BaseButton>
						<BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8">
							<BellIcon class="h-6 opacity-50" @click="addNotification()"/>
						</BaseButton>
						<img :src="currentUser?.photoURL || '/public/img/user.svg'" class="w-8 h-8 rounded-full border-primary border cursor-pointer" @click="navigate('profile')"/>
					</div>
					<div v-else class="flex gap-x-3">
						<BaseButton theme="tertiary" @click="navigate('login')" class="border border-primary"><b>{{$t('signIn.logIn')}}</b></BaseButton>
						<BaseButton theme="magic" @click="navigate('register')"><b>{{$t('signIn.createAccount')}}</b></BaseButton>
					</div>
				</div>
				<div id="rightNavBurger" class="self-center flex gap-x-3 max-h-8 lg:hidden z-20">
					<HUMenu as="div" class="self-center flex">
						<MenuButton class="self-center">
							<MenuIcon class="w-6 text-[color:var(--wt-color-text-grey)]"/>
						</MenuButton>

						<transition
						enter-active-class="transition duration-100 ease-out"
						enter-from-class="transform scale-95 opacity-0"
						enter-to-class="transform scale-100 opacity-100"
						leave-active-class="transition duration-75 ease-in"
						leave-from-class="transform scale-100 opacity-100"
						leave-to-class="transform scale-95 opacity-0"
						>
						<!--			LOOK HERE - SIDE-MENU			 -->
							<MenuItems
								class="h-screen px-5 sm:px-0 py-32 sm:py-0 sm:h-auto fixed left-0 sm:left-auto w-3/4 sm:w-56 sm:right-0 ml-auto mr-auto bottom-0 sm:bottom-auto sm:top-16 sm:origin-top-right max-w-sm sm:rounded-md glassDropDown shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
								<div class="flex flex-col sm:hidden p-1">
									<MenuItem>

										<BaseButton theme="menuButtonSMWhite" :center-text="false" :clicked="shouldBeHighlighted('dashboard')" @click="navigate('dashboard')">{{$t('common.home')}}</BaseButton>
									</MenuItem>
									<MenuItem>
										<BaseButton theme="menuButtonSMWhite" :center-text="false" :clicked="shouldBeHighlighted('favorites')" @click="navigate('favorites')">{{$t('common.favorites')}}</BaseButton>
									</MenuItem>
									<MenuItem>
										<BaseButton theme="menuButtonSMWhite" :center-text="false" :clicked="shouldBeHighlighted('themes')" @click="navigate('themes')">{{$t('common.themes')}}</BaseButton>
									</MenuItem>
									<MenuItem>
										<BaseButton theme="menuButtonSMWhite" :center-text="false" :clicked="shouldBeHighlighted('history')" @click="navigate('history')">{{$t('common.history')}}</BaseButton>
									</MenuItem>
								</div>
								<div class="hidden sm:flex p-1">
									<BaseInput :inside-h-u-menu="true" v-model="searchWord" :placeholder="$t('common.search')" style-type="search" class="self-center" @search-action="search($event)" @keydown.enter="search(undefined)"/>
								</div>
								<div v-if="currentUser === null" class="p-1">
									<MenuItem>
										<div class="flex gap-2 max-h-8">
											<BaseButton theme="tertiary" @click="navigate('login')" class="border grow border-primary"><b>{{$t('signIn.logIn')}}</b></BaseButton>
											<BaseButton theme="magic" @click="navigate('register')" class="grow"><b>{{$t('signIn.createAccount')}}</b></BaseButton>
										</div>
									</MenuItem>
								</div>
								<div v-else class="p-1 border-t border-white/30 sm:border-black/30">
									<MenuItem>
										<div class="flex gap-2 max-h-8">
											<BaseButton class="w-full" theme="menuButtonSMWhite" :center-text="false" :clicked="shouldBeHighlighted('profile')" @click="navigate('profile')">{{$t('common.profile')}}</BaseButton>
										</div>
									</MenuItem>
									<MenuItem>
										<div class="flex gap-2 max-h-8">
											<BaseButton class="w-full" theme="menuButtonSMWhite" :center-text="false" @click="{}">{{$t('common.notifications')}}</BaseButton>
										</div>
									</MenuItem>
									<MenuItem>
										<div class="flex gap-2 max-h-8">
											<BaseButton class="w-full" theme="menuButtonSMWhite" :center-text="false" @click="{}">{{$t('common.help')}}</BaseButton>
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
import { BellIcon, QuestionMarkCircleIcon, MenuIcon, HomeIcon, SearchIcon } from "@heroicons/vue/outline";
import { getCurrentUserPromise } from "@/services/auth";
import type { User } from "firebase/auth";
import breakpoints from "@/style/breakpoints";
import { Menu as HUMenu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import SearchModal from "./SearchModal.vue";
import { Notification } from '@/classes/notification';

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
	MenuIcon,
	HomeIcon,
	SearchIcon,
	SearchModal,
},
	data: () => ({
		open: false,
		searchWord: "",
		currentUser: null as User | null,
		store: useSessionStore(),
		breakpoints: breakpoints,
		showSearchModal: false,

		removeThis: 0
	}),
	async beforeMount() {
		this.currentUser = await getCurrentUserPromise();
	},
	methods: {
		search(searchWord : string | undefined){
			if (searchWord === undefined) searchWord = this.searchWord;
			useSessionStore().searchWordBridge = searchWord;
			if (!this.$route.matched.some(x => x.name === "search"))
				router.push({name: "search"});
		},
		navigate(name: string, e? : Event){

			if (name === "register"){
				//Just to mmake sure the login forms appears as 'register' and not as 'login'
				this.store.loginFormBridge = "register";
				name = "login";
			}
			router.push({name: name});
		},
		addNotification(){
			this.store.notifications.push(new Notification(this.$t('notifications.placeholderMsg') + this.removeThis.toString()));
			this.removeThis++;
		},
		shouldBeHighlighted(requiredName: string) : boolean {
			return this.$route.matched.some(x => x.name === requiredName);
		}
	},
});
</script>

<style scoped>

.glassDropDown {
	background: #3d6e7cab;
	backdrop-filter: blur(7px);
	-webkit-backdrop-filter: blur(7px);
}
@media(min-width:640px){
	.glassDropDown {
		background: rgba(255, 255, 255, 0.5);
	}
}
/* .glassDropDown > div {
	background: rgba(255, 255, 255, 0.5);
} */
</style>