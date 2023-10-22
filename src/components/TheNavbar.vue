<template>
	<nav class="mainNav shadow-md z-50 max-h-16 sm:max-h-16" @mouseup="store.globalCloseModal = !store.globalCloseModal">
		<div id="glassEffect" class="absolute glass w-full h-full" />
		<div class="w-full bg-white">
			<div
				class="h-full max-w-7xl xl:mx-auto mx-3 flex sm:flex-row min-h-[4rem] flex-row-reverse justify-around sm:justify-start px-8 border-t border-[color:var(--wt-color-ui-lm-dark)]">
				<div id="leftNav" class="self-center flex gap-x-3">
					<img class="h-8 min-w-[2.5rem] cursor-pointer hidden sm:block" src="/img/logo.svg"
						@click="navigate('dashboard')" />
					<div class="flex sm:hidden self-center place-content-center cursor-pointer">
						<SearchIcon class="w-6 text-[color:var(--wt-color-text-grey)]" @click="showSearchModal = true" />
						<SearchModal :show="showSearchModal" v-model="store.searchWord"
							@search-action="{ showSearchModal = false; search($event) }" @close="showSearchModal = false" />
					</div>
				</div>
				<div id="middleNav" class="sm:flex self-center hidden grow place-content-left gap-x-3 max-h-8 pl-6">
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('dashboard')" 
						@click="(e: Event | undefined) => navigate('dashboard', e)">{{ $t('common.home') }}</BaseButton>
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('favorites')" :disabled="!store.userHasSubscription"
						@click="(e: Event | undefined) => navigate('favorites', e)">{{ $t('common.favorites') }}
					</BaseButton>
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('themesIndex')" :disabled="!store.userHasSubscription"
						@click="navigate('themes')">{{ $t('common.themes') }}</BaseButton>
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('history')" @click="navigate('history')" :disabled="!store.userHasSubscription">
						{{ $t('common.history') }}</BaseButton>
					<BaseButton theme="menuButton" :clicked="shouldBeHighlighted('origins')" @click="navigate('origins')" :disabled="!store.userHasSubscription">
						Origins
					</BaseButton>
				</div>
				<div class="flex sm:hidden self-center place-content-center cursor-pointer" @click="navigate('dashboard')">
					<HomeIcon class="w-6 text-[color:var(--wt-color-text-grey)]" />
				</div>
				<div id="rightNav" class="self-center hidden gap-x-3 max-h-8 lg:flex">
					<BaseInput v-model="store.searchWord" :placeholder="$t('common.search')" style-type="search"
						class="self-center" @search-action="search($event)" />
					<div v-if="currentUser !== null" class="flex gap-x-3 ml-2">

						<img :src="currentUser?.photoURL || '/img/user.svg'"
							class="w-8 h-8 rounded-full border-primary border cursor-pointer"
							@click="navigate('profile')" alt="YourPicture"/>
					</div>
					<div v-else class="flex gap-x-3">
						<BaseButton theme="tertiary" @click="navigate('login')" class="border border-primary">
							<b>{{ $t('signIn.logIn') }}</b>
						</BaseButton>
						<BaseButton theme="magic" @click="navigate('register')"><b>{{ $t('signIn.createAccount') }}</b>
						</BaseButton>
					</div>
				</div>
				<div id="rightNavBurger" class="self-center flex gap-x-3 max-h-8 lg:hidden z-20">
					<HUMenu as="div" class="self-center flex" :key="refreshBurgerNav ? 'a' : 'b'">
						<MenuButton class="self-center" @click="showBurgerNavBar = true">
							<MenuIcon class="w-6 text-[color:var(--wt-color-text-grey)]" />
						</MenuButton>

						<transition 
							v-show="showBurgerNavBar"
							enter-active-class="transition ease-in-out duration-200 transform"
							enter-from-class="-translate-x-full"
							enter-to-class="translate-x-0"
							leave-active-class="transition ease-in-out duration-200 transform"
							leave-from-class="translate-x-0"
							leave-to-class="-translate-x-full"
							>
							<!--			MOBILE MENU			    -->
							<MenuItems
								class="h-screen sm:h-auto fixed left-0 sm:left-auto w-2/3 sm:right-0 ml-auto mr-auto bottom-0 sm:bottom-auto sm:top-16 sm:origin-top-right sm:w-40 sm:rounded-md 
								glass bg-white/60 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
								>
								<div class="w-full h-full py-20 px-8 sm:px-0 sm:py-0" 
									@mousedown="(e) => swipeNavBurgerMouseDownX = e.clientX"
									@mouseup="(e) => {if (swipeNavBurgerMouseDownX > (e.clientX + 20)) {showBurgerNavBar = false; setRefreshBurgerNav();} }"
									@touchstart="(e) => swipeNavBurgerMouseDownX = e.touches[0].clientX"
									@touchend="(e) => {if (swipeNavBurgerMouseDownX > (e.changedTouches[0].clientX + 20)) {showBurgerNavBar = false; setRefreshBurgerNav();} }"
									>
									<div class="flex flex-col sm:hidden">
										<MenuItem>
										<BaseButton theme="menuButton" :center-text="false"
											:clicked="shouldBeHighlighted('dashboard')" @click="navigate('dashboard')">
											{{ $t('common.home') }}</BaseButton>
										</MenuItem>
										<MenuItem>
										<BaseButton :theme="store.userHasSubscription ? 'menuButton' : 'disabled'" :center-text="false"
											:clicked="shouldBeHighlighted('favorites')" @click="store.userHasSubscription && navigate('favorites')">
											{{ $t('common.favorites') }}</BaseButton>
										</MenuItem>
										<MenuItem>
										<BaseButton :theme="store.userHasSubscription ? 'menuButton' : 'disabled'" :center-text="false"
											:clicked="shouldBeHighlighted('themes')" @click="store.userHasSubscription && navigate('themes')">
											{{ $t('common.themes') }}</BaseButton>
										</MenuItem>
										<MenuItem>
										<BaseButton :theme="store.userHasSubscription ? 'menuButton' : 'disabled'" :center-text="false"
											:clicked="shouldBeHighlighted('history')" @click="store.userHasSubscription && navigate('history')">
											{{ $t('common.history') }}</BaseButton>
										</MenuItem>
										<MenuItem>
										<BaseButton :theme="store.userHasSubscription ? 'menuButton' : 'disabled'" :center-text="false"
											:clicked="shouldBeHighlighted('origins')" @click="store.userHasSubscription && navigate('origins')">
											{{ $t('common.origin') }}</BaseButton>
										</MenuItem>
									</div>
									<div v-if="currentUser === null" class="">
										<MenuItem>
										<div class="flex gap-2 max-h-8">
											<BaseButton theme="tertiary" @click="navigate('login')"
												class="border grow border-primary"><b>{{ $t('signIn.logIn') }}</b></BaseButton>
											<BaseButton theme="magic" @click="navigate('register')" class="grow">
												<b>{{ $t('signIn.createAccount') }}</b>
											</BaseButton>
										</div>
										</MenuItem>
									</div>
									<div v-else class=" border-t border-white/30 sm:border-black/30">
										<MenuItem>
										<div class="flex">
											<BaseButton class="w-full" :theme="store.userHasSubscription ? 'menuButton' : 'disabled'" :center-text="false"
												:clicked="shouldBeHighlighted('search')" @click="store.userHasSubscription && navigate('search')">
												{{ $t('common.search') }}</BaseButton>
										</div>
										</MenuItem>
										<MenuItem>
										<div class="flex">
											<BaseButton class="w-full" theme="menuButton" :center-text="false"
												:clicked="shouldBeHighlighted('profile')" @click="navigate('profile')">
												{{ $t('common.profile') }}</BaseButton>
										</div>
										</MenuItem>
									</div>
									<img class="w-10 fixed left-8 buttom-5 mt-16" src="/img/logo.svg"/>
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
import { MenuIcon, HomeIcon, SearchIcon } from "@heroicons/vue/outline";
import { getCurrentUserPromise } from "@/services/auth";
import type { User } from "firebase/auth";
import breakpoints from "@/style/breakpoints";
import { Menu as HUMenu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import SearchModal from "./Search/SearchModal.vue";
import { log } from '@/services/logger'

export default defineComponent({
	name: "the-navbar",
	components: {
		BaseInput,
		BaseButton,
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
		currentUser: null as User | null,
		store: useSessionStore(),
		breakpoints: breakpoints,
		showSearchModal: false,
		swipeNavBurgerMouseDownX: 0 as number,
		showBurgerNavBar: true as boolean,
		refreshBurgerNav: false as boolean,
	}),
	async beforeMount() {
		this.currentUser = await getCurrentUserPromise();
	},
	methods: {
		setRefreshBurgerNav(){
			setTimeout(() => {
				this.refreshBurgerNav = !this.refreshBurgerNav;
			}, 200);
		},
		search(searchWord: string | undefined) {
			log && console.log("SearchedWord: ", searchWord);
			if (searchWord === undefined) return;

			if (!this.$route.matched.some((x: { name: string; }) => x.name === "search"))
				router.push({ name: "search" });
		},
		navigate(name: string) {

			if (name === "register") {
				//Just to mmake sure the login forms appears as 'register' and not as 'login'
				this.store.loginFormBridge = "register";
				name = "login";
			}
			router.push({ name: name });
		},
		shouldBeHighlighted(requiredName: string): boolean {
			return this.$route.matched.some((x: { name: string; }) => x.name === requiredName);
		}
	},
});
</script>

<style scoped>

.mainNav{
	-webkit-transform:translate3d(0,0,1);
	transform: translate3d(0,0,1);
}

</style>