<template>
  <main>
    <div>Hello and welcome to empty home view. This site requires auth, but not subscriptions</div>
    <br/>
    <button  @click="$router.push({ name: 'dashboard' })">Click here to go to real home page!</button>
    <br/>
    <button  @click="seeCredentials()">Click here to go to see user credentials!</button>
    <div>{{ currentUser }}</div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { auth } from '@/services/auth';

export default defineComponent({
  name: "EmptyHomeView",
  data() {
      return {
        currentUser: "" as string
      }
    },
  methods:{
    seeCredentials(){
      this.currentUser = `Current User: ${auth.currentUser?.displayName} ${auth.currentUser?.email} Emailverified:${auth.currentUser?.emailVerified}`;
    },
  }
});
</script>
<style scoped>
</style>