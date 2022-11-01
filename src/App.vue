<template>
    <RouterView/>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { RouterView } from 'vue-router'
import { auth, getCurrentUser } from './services/auth';

onBeforeMount(async () => {
    // Get the user from firebase if it exist. Just to make sure redirects work properly
    if (auth.currentUser) return;
    await getCurrentUser();
});

</script>