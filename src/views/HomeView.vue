<template>
  <main>
    <input v-model="email" placeholder="email" />
    <input v-model="password" placeholder="password" />
    <button @click="login" class="bg-red-500 p-5">Login!</button>
    <TheWelcome/>
  </main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import TheWelcome from '../components/TheWelcome.vue';
  import { loginWithEmailAndPassword } from '@/services/auth';

  export default defineComponent({
    name: "chordtooltip-component",
    props: {
    },
    components: {
      TheWelcome
    },
    data: () => ({
      email: "",
      password: "",
    }),
    computed: {
    },
    mounted() { 
    },
    methods: {
      async login(){
        await loginWithEmailAndPassword(this.email, this.password);
      }
    },
  });
</script>