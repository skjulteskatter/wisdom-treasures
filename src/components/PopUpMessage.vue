<template>
	<div class="absolute left-1/2 z-20">
		<TransitionRoot
			:show="open"
			as="div"
			class='mb-2 absolute bottom-full px-2 py-1 -left-1/2 -translate-x-1/2 rounded-md shadow z-10 border-2 bg-white border-primary'
			enter="transition duration-100 ease-out"
			enter-from="opacity-0 translate-y-1"
			enter-to="opacity-100 translate-y-0"
			leave="transition duration-50 ease-in"
			leave-from="opacity-100"
			leave-to="opacity-0"
		>
            <div class="bg-white h-2 w-1/2 bottom-0 absolute">

            </div>
            <span
                class="bg-primary w-2 h-2 rotate-45 absolute left-1/2 -translate-x-1/2 -z-10 -bottom-1"
            ></span>
			<small class="whitespace-nowrap font-bold">{{ text }}</small>
		</TransitionRoot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TransitionRoot } from "@headlessui/vue";

export default defineComponent({
    name: "popupmessage-component",
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            default: "",
        },
    },
    components: {
		TransitionRoot,
	},
});
</script>
