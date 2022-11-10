<template>
	<nav class="sticky top-0 shadow-md z-30 glass">
		<div class="w-full bg-white/50">
			<div class="h-full max-w-7xl mx-auto flex min-h-[4rem]">
				<div id="leftNav" class="self-center flex gap-x-3">
					<img class="h-10 cursor-pointer" src="/img/logo.svg" @click="$router.push({name: 'home'})"/>
				</div>
				<div id="middleNav" class="self-center flex grow place-content-center gap-x-3">
					<BaseButton theme="menuButton">Menu1!</BaseButton>
					<BaseButton theme="menuButton">Menu2!</BaseButton>
					<BaseButton theme="menuButton">Menu3!</BaseButton>
					<BaseButton theme="menuButton">Menu4!</BaseButton>

				</div>
				<div id="rightNav" class="self-center flex gap-x-3">
					<BaseInput v-model="searchPhrase" placeholder="Search" style-type="search" class="self-center" @search-action="search($event)"/>
					<img class="h-10 cursor-pointer hue-rotate-180" src="/img/logo.svg" @click="$router.push({name: 'home'})"/>
				</div>
			</div>
		</div>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";
export default defineComponent({
	name: "the-navbar",
	components: {
    BaseInput,
	BaseButton
},
	data: () => ({
		open: false,
		searchPhrase: ""
	}),
	computed: {
		
	},
	async mounted() {
	},
	methods: {
		search(searchPhrase : string){
			console.log("Search is not implemented yet. You searched for: " + searchPhrase);
		}
	},
});
</script>

<style>
.glass {
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}
</style>