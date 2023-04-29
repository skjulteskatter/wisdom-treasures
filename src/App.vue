<template>
    <RouterView/>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { RouterView } from 'vue-router'
import { auth, getCurrentUserPromise } from './services/auth';

onBeforeMount(async () => {
    // Get the user from firebase if it exist. Just to make sure redirects work properly
    if (auth.currentUser) return;
    await getCurrentUserPromise();
})

</script>

<style>
    body{
        width: 100%;
        height: 100%;
    }
</style>