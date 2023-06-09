<template>
        
        <RouterView />
        <SuggestionForm/>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { RouterView } from 'vue-router'
import { auth, getCurrentUserPromise } from './services/auth';
import SuggestionForm from './components/SuggestWWForm.vue'
onBeforeMount(async () => {
    // Get the user from firebase if it exist. Just to make sure redirects work properly
    if (auth.currentUser) return;
    await getCurrentUserPromise();
})

</script>

<style>
body {
    width: 100%;
    height: 100%;
}
</style>