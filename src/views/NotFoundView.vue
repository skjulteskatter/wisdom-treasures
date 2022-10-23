<template>
  <main>
    <h1>404 - Page not found</h1>
    <router-link v-if="isLoggedIn" to="/">Go to home page</router-link>
    <router-link v-else to="/login">Go to login page</router-link>
  </main>
</template>

<script lang="ts">
import { auth } from '@/services/auth';
import { defineComponent } from 'vue';

  export default defineComponent({
    name: "NotFoundView",
    computed: {
      isLoggedIn() {
        return !!auth.currentUser
      }
    }
  });
</script>