<template>
	<div class="flex flex-col h-full">
		<!-- <img id="background-img" src="../../images/bg-soft-2.png" class="hidden sm:block fixed -top-10 left-0 w-custom-45rem -z-20"/> -->
		<!-- <img id="background-img" src="../../images/bg-soft-1.png" class="hidden sm:block fixed -top-10 -right-44 2xl:-right-5 w-custom-45rem -z-20"/> -->
		<main class="flex-grow pb-16 sm:pb-0 sm:pt-16">
			<div class="h-full max-w-7xl mx-auto flex flex-col sm:px-8">
				<!-- Route transitions -->
				<router-view v-slot="{ Component }" class="grow">
					<Loader :loading="!isIntitialized">
						<transition mode="out-in" enter-active-class="transition duration-100 ease-out"
							enter-from-class="opacity-0 -translate-x-1" enter-to-class="opacity-100 translate-x-0"
							leave-active-class="transition duration-50 ease-in" leave-from-class="opacity-100 translate-x-0"
							leave-to-class="opacity-0 translate-x-1">
							<component :is="Component" />
						</transition>
					</Loader>
				</router-view>
				<FooterComponent />
			</div>
		</main>
		<TheNavbar class="sm:order-first w-full fixed bottom-0 sm:top-0" />
		<SuggestWWForm class="z-50"/>
		<NotificationContainer class="h-full" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SuggestWWForm from '../components/SuggestWWForm.vue'

import TheNavbar from "@/components/TheNavbar.vue";
import { XIcon } from "@heroicons/vue/solid";
import Loader from "@/components/Loader.vue";
import { getCurrentUserPromise } from "@/services/auth";
import FooterComponent from '@/components/FooterComponent.vue';
import BaseCard from "@/components/BaseCard.vue";
import NotificationCard from "@/components/Notification/NotificationCard.vue";
import NotificationContainer from "@/components/Notification/NotificationContainer.vue";
import { useSessionStore } from "@/stores/session";
import { log } from '@/services/env';

export default defineComponent({
	name: "main-layout",
	components: {
		TheNavbar,
		XIcon,
		Loader,
		FooterComponent,
		BaseCard,
		NotificationCard,
		NotificationContainer,
		SuggestWWForm
	},
	data: () => ({
		currentUser: undefined as unknown,
		store: useSessionStore(),
	}),
	async mounted() {
		this.currentUser = await getCurrentUserPromise();
	},
	computed: {
		isIntitialized(): boolean {
			log && console.log('IN MAINVIEW: ', this.store.sessionInitialized)
			return this.store.sessionInitialized;
		}
	}
});
</script>
<style>
.w-custom-45rem {
	width: 45rem
}
</style>
