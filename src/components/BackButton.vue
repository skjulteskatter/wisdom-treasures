<template>
    <BaseButton class="z-50" theme="menuButton" @click="navigateBack">
        <template #firstIcon>
            <ArrowLeftIcon class="h-4 text-white sm:text-inherit"/>
        </template>
    </BaseButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from './BaseButton.vue';
import { ArrowLeftIcon } from '@heroicons/vue/solid';
import router from '@/router';

export default defineComponent({
    name: "back-button",
    components: {
        BaseButton,
        ArrowLeftIcon,
    },
    methods: {
        navigateBack(){
            if (router.options.history.state.back == null){
                router.push({name: "dashboard"});
            } else {
                router.back();
            }
        }
    }
});
</script>