<template>
	<nav class="sticky top-0 shadow-md z-30 glass">
		<div class="w-full bg-white/50">
			<div class="h-full max-w-7xl mx-auto flex">
				<img class="h-10 cursor-pointer" src="/public/img/logo.svg" @click="$router.push({name: 'home'})"/>
				<BaseInput class="h-5 align-bottom self-center"/>
				<img class="h-10 cursor-pointer ml-auto hue-rotate-180" src="/public/img/logo.svg" @click="$router.push({name: 'profile'})"/>
			</div>
		</div>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseInput from "./BaseInput.vue";
export default defineComponent({
	name: "the-navbar",
	components: {
    BaseInput
},
	data: () => ({
		open: false,
		showCart: false,
	}),
	computed: {
		
	},
	async mounted() {
	},
	methods: {
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