<template>
  <main>
    <h1>Yo {{getFullName}}! Welcome to the profile view. This is mainly created for <b>testing</b> puposes</h1>
  </main>
</template>

<script lang="ts">
import { auth } from '@/services/auth';
import { defineComponent } from 'vue';

  export default defineComponent({
    name: "ProfileView",
    data() {
      return {
        publications : [],
        articles : [],
      }
    },
    props: {
    },
    components: {
    },
    computed: {
      getFullName(): string{
        return auth.currentUser?.displayName ?? "man";
      }
    },
    methods: {
    },
  });
</script>