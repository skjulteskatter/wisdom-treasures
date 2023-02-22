<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      Profile
    </h1>
    <div>
      <BaseCard>
        <template #header>
          <div class="flex flex-row place-items-center">
            <img :src="currentUser?.photoURL || '/img/user.svg'" class="h-28 rounded-full border-primary border-2"/>
            <h1 class="my-6 text-3xl font-bold font-sans ">
              {{getFullName}}
            </h1>
          </div>
          
        </template>
        <template #default>
          <div class="flex flex-row place-items-center">
            <BaseInput :placeholder="getFullName"></BaseInput>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-row place-items-center">

          </div>
        </template>
      </BaseCard>
    </div>
    <h1>Yo {{getFullName}}! Welcome to the profile view. This is mainly created for <b>testing</b> puposes</h1>
  </main>
</template>

<script lang="ts">
import { auth, getCurrentUserPromise } from '@/services/auth';
import { useSessionStore } from '@/stores/session';
import { defineComponent } from 'vue';
import type { User } from "firebase/auth";
import BaseCard from '@/components/BaseCard.vue';
import BaseInput from '@/components/BaseInput.vue';

  export default defineComponent({
    name: "ProfileView",
    data() {
      return {
        currentUser: null as User | null,
        store: useSessionStore(),
      }
    },
    props: {
    },
    components: {
      BaseCard,
      BaseInput
    },
    computed: {
      initialized(){
        return this.store.sessionInitialized;
      },
      getFullName() : string{
        if (this.currentUser === null || this.currentUser.displayName === null) return "";
        return this.currentUser.displayName;
      },
    },
    watch: {
      async initialized(newValue){
        if (newValue){
          await this.setCurrentUser();
        }
      }
    },
    methods: {
      async setCurrentUser(){
        this.currentUser = await getCurrentUserPromise();
      }
    },
    mounted() {
      if (this.initialized)
        this.setCurrentUser();
    }
  });
</script>