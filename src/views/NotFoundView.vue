<template>
  <main class="col-span-2">
    <div class="flex items-center flex-col text-[1.5rem]">
      <div class="text-[6rem] text-primary font font-bold">404</div>
      <div class="h-[1px] bg-black/30 w-full" />
      <div class="mt-3 font-bold">Page not Found</div>
      <ClickableLink class="font-bold" v-if="isLoggedIn" @link-clicked="redirect('home')">Go to home page</ClickableLink>
      <ClickableLink class="font-bold" v-else @link-clicked="redirect('login')">Go to login page</ClickableLink>
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