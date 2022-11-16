<template>
	<nav class="sticky top-0 shadow-md z-30 glass">
		<div class="w-full bg-white/50">
			<div class="h-full max-w-7xl mx-auto flex min-h-[4rem]">
				<div id="leftNav" class="self-center flex gap-x-3">
					<img class="h-10 min-w-[2.5rem] cursor-pointer" src="/img/logo.svg" @click="navigate('dashboard')"/>
				</div>
				<div id="middleNav" class="self-center flex grow place-content-center gap-x-3 max-h-8">
					<BaseButton theme="menuButton" :clicked="$route.name === 'dashboard'" @click="navigate('dashboard')">Home</BaseButton>
					<BaseButton theme="menuButton" :clicked="$route.name === 'favorites'" @click="navigate('favorites')">Favorites</BaseButton>
					<BaseButton theme="menuButton" :clicked="$route.name === 'categories'" @click="navigate('categories')">Menu3!</BaseButton>
					<BaseButton theme="menuButton">Menu4!</BaseButton>

				</div>
				<div v-if="currentUser !== null" id="rightNav" class="self-center flex gap-x-3">
					<BaseInput v-model="searchWord" placeholder="Search" style-type="search" class="self-center" @search-action="search($event)"/>
					<BaseButton theme="menuButton" size="small" class="max-h-8 w-8 self-center">
						<QuestionMarkCircleIcon  class="h-7 opacity-50"/>
					</BaseButton>
					<BaseButton theme="menuButton" size="small" class="max-h-8 w-8 self-center">
						<BellIcon class="h-7 opacity-50"/>
					</BaseButton>
					<img :src="currentUser.photoURL || ''" alt="profile" class="w-8 h-8 rounded-full border-primary border cursor-pointer"/>
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
import { BellIcon, QuestionMarkCircleIcon  } from "@heroicons/vue/outline";
import { getCurrentUserPromise } from "@/services/auth";
import type { User } from "firebase/auth";

export default defineComponent({
	name: "the-navbar",
	components: {
    BaseInput,
	BaseButton,
	BellIcon,
	QuestionMarkCircleIcon,

},
	data: () => ({
		open: false,
		searchWord: "",
		currentUser: null as User | null,
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
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}
</style>