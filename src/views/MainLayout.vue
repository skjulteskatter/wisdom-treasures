<template>
	<div class="flex flex-col h-full">
		<TheNavbar/>
		<main class="flex-grow">
			<div class="h-full max-w-7xl mx-auto border border-black/25 border-dashed">
				<!-- Route transitions -->
				<router-view v-slot="{ Component }">
					<transition
						mode="out-in"
						enter-active-class="transition duration-100 ease-out"
						enter-from-class="opacity-0 -translate-x-1"
						enter-to-class="opacity-100 translate-x-0"
						leave-active-class="transition duration-50 ease-in"
						leave-from-class="opacity-100 translate-x-0"
						leave-to-class="opacity-0 translate-x-1"
					>
						<component :is="Component"/>
					</transition>
				</router-view>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import TheNavbar from "@/components/TheNavbar.vue";
import { XIcon } from "@heroicons/vue/solid";
import Loader from "@/components/Loader.vue";
import { getCurrentUserPromise } from "@/services/auth";

export default defineComponent({
	name: "main-layout",
	components: {
    TheNavbar,
    XIcon,
	Loader,
},
	data: () => ({
		currentUser : undefined as unknown,
	}),
	async mounted() {
		this.currentUser = await getCurrentUserPromise();
    },
	methods: {
	},
});
</script>
