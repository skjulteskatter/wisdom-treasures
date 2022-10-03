<template>
  <main>
    <h1>Login today!</h1>
    <input v-model="email" placeholder="email" />
    <input v-model="password" placeholder="password" />
    <button @click="login" class="bg-red-500 p-5">{{$t("common_login")}}</button>
    <button @click="signup" class="bg-green-500 p-5">{{$t("common_singup")}}</button>
    <button @click="changeLanguage" class="bg-yellow-500 p-5">Change language!</button>

  </main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useSessionStore } from '@/stores/session';
import { loginWithEmailAndPassword } from '@/services/auth';

  export default defineComponent({
    name: "chordtooltip-component",
    props: {
    },
    components: {
    },
    data: () => ({
      email: "",
      password: "",
      store: useSessionStore(),
    }),
    computed: {
    },
    mounted() { 
    },
    methods: {
      async login(){
        loginWithEmailAndPassword(this.email, this.password);
      },
      async signup(){
        
      },
      async changeLanguage(){
        if (this.store.locale == "en") this.store.setLocale("no");
        else this.store.setLocale("en");
      }
    },
  });
</script>