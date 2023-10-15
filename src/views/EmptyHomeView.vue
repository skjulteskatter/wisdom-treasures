<template>
  <main>
    <div>Hello and welcome to empty home view. This site requires auth, but not subscriptions</div>
    <button  @click="$router.push({ name: 'dashboard' })">Click here to go to real home page!</button>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "EmptyHomeView",
});
</script>
<style scoped>
</style>