<template>
  <main class="col-span-2">
    <div class="flex items-center flex-col">
      <div class="text-[6rem] text-primary font">404</div>
      <div> - Page not Found</div>
      <ClickableLink v-if="isLoggedIn" @link-clicked="redirect('home')">Go to home page</ClickableLink>
      <ClickableLink v-else @link-clicked="redirect('login')">Go to login page</ClickableLink>
    </div>
  </main>
</template>

<script lang="ts">
import ClickableLink from '@/components/ClickableLink.vue';
import router from '@/router';
import { auth } from '@/services/auth';
import { defineComponent } from 'vue';

  export default defineComponent({
    name: "NotFoundView",
    computed: {
        isLoggedIn() {
            return !!auth.currentUser;
        }
    },
    components: { ClickableLink },
    methods: {
      redirect(name: string) {
        router.push({name: name});
      }
    }
});
</script>