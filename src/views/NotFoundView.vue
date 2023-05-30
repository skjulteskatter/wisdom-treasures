<template>
  <main>
    <div class="flex items-center flex-col text-[1.5rem]">
      <div class="text-[6rem] gradient font font-bold">404</div>
      <div class="h-[1px] bg-black/30 w-full max-w-xs" />
      <div class="mt-3 font-bold">{{ $t('notFound.notFoundMsg') }}</div>
      <ClickableLink class="font-bold" v-if="isLoggedIn" @link-clicked="navigate('dashboard')">{{ $t('notFound.goToHome') }}</ClickableLink>
      <ClickableLink class="font-bold" v-else @link-clicked="navigate('login')">{{ $t('notFound.goToLogin') }}</ClickableLink>
    </div>
  </main>
</template>

<script lang="ts">
import ClickableLink from '@/components/ClickableLink.vue';
import router from '@/router';
import { getCurrentUserPromise } from '@/services/auth';
import { defineComponent } from 'vue';

  export default defineComponent({
    name: "NotFoundView",
    data() {
      return {
        isLoggedIn: false,
      }
    },
    components: { ClickableLink },
    methods: {
      navigate(name: string) {
        router.push({name: name});
      }
    },
    async mounted(){
      this.isLoggedIn = (await getCurrentUserPromise()) != null;
    }
});
</script>