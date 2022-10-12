<template>
  <div>
    <BaseCard>
      <template #header>
        <div class="flex justify-center">
          <h1 class="text-lg">Login today!</h1>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col">
          <input v-model="email" placeholder="email" />
          <input v-model="password" placeholder="password" />
          <div>
            <BaseButton 
            @click="login()"  
            theme="primary" 
            >{{$t("common_login")}}
            </BaseButton>
            <button @click="login('google')" class="bg-gray-500 text-[color:white] p-5">{{$t("common_login")}}<img class="h-5" src="/img/google.svg"/> GOOGLE </button>
            <button @click="login('apple')" class="bg-black text-[color:white] p-5">{{$t("common_login")}} <img class="h-5 invert" src="/img/apple.svg"/>APPLE </button>
          </div>
          <button @click="signup()" class="bg-[color:var(--wt-color-primary)] text-[color:black] p-5">{{$t("common_register")}}</button>
          <input type="checkbox" v-model="rememberMe"><label>Remember me!</label>
          <button @click="changeLanguage" class="bg-yellow-500 p-5">Change language!</button>
        </div>
      </template>
      <template #footer>
        <p>This is the footer ok</p>
      </template>
    </BaseCard>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useSessionStore } from '@/stores/session';
  import { loginWithEmailAndPassword, signupWithEmailAndPassword, loginWithProvider} from '@/services/auth';
  import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'

  export default defineComponent({
    name: "LoginView",
    props: {
    },
    components: {
    BaseCard,
    BaseButton
},
    data: () => ({
      email: "",
      password: "",
      rememberMe: false,
      store: useSessionStore(),
    }),
    computed: {
    },
    mounted() { 
    },
    methods: {
      async login(provider : string | undefined = undefined){
        if (provider){
          loginWithProvider(provider, this.rememberMe);
        } else {
          loginWithEmailAndPassword(this.email, this.password, this.rememberMe);
        }
        
      },
      async signup(){
        signupWithEmailAndPassword(this.email, this.password);
      },
      async changeLanguage(){
        if (this.store.locale == "en") this.store.setLocale("no");
        else this.store.setLocale("en");
        console.log(this.rememberMe);
      }
    },
  });
</script>