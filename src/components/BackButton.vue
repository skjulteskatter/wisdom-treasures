<template>
    <BaseButton theme="menuButton" @click="navigateBack">
        <template #default>
            <div class="text-lg">Back</div>
        </template>
        <template #firstIcon>
            <ArrowLeftIcon class="h-5"/>
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