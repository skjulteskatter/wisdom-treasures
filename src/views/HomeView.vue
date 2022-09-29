<template>
  <main>
    <input v-model="email" placeholder="email" />
    <input v-model="password" placeholder="password" />
    <button @click="login" class="bg-red-500 p-5">{{$t("common_login")}}</button>
    <button @click="signup" class="bg-green-500 p-5">{{$t("common_singup")}}</button>
    <button @click="changeLanguage" class="bg-yellow-500 p-5">change language!</button>

  </main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { loginWithEmailAndPassword, signupWithEmailAndPassword } from '@/services/auth';
  import { useSessionStore } from '@/stores/session';

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
        await loginWithEmailAndPassword(this.email, this.password);
      },
      async signup(){
        await signupWithEmailAndPassword(this.email, this.password);
      },
      async changeLanguage(){
        if (this.store.locale == "en") this.store.setLocale("no");
        else this.store.setLocale("en");
      }
    },
  });
</script>