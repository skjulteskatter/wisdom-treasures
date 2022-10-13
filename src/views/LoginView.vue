<template>
  <div class="w-full">
    <BaseCard>
      <template #header>
        <div class="flex justify-center">
          <h1 class="text-lg">Login today!</h1>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col">
          <BaseInput v-model="email" label="Email" class="p-4 border mt-2"/>
          <BaseInput v-model="password" label="Password" class="p-4 border mt-2"/>
          <div class="grid grid-cols-1 mt-4">
            <BaseButton 
            @click="login()"  
            theme="neutral">
              {{$t("common_login")}}
            </BaseButton>
          </div>
          <div class="grid grid-cols-2 mt-4 gap-4">
            <BaseButton 
              @click="login('google')" theme="neutral">
              <img class="w-10 object-contain" src="/img/google.svg"/>
            </BaseButton>

            <BaseButton 
              @click="login('apple')" theme="neutral">
              <img class="w-10 object-contain" src="/img/apple.svg"/>
            </BaseButton>
          </div>
          <div class="flex gap-4 my-4">
            <div class="grow h-px bg-gray-500 self-center"/>
            <p class="grow-0 text-gray-500 self-center">or</p>
            <div class="grow h-px bg-gray-500 self-center"/>
          </div>
          <button @click="signup()" class="bg-[color:var(--wt-color-primary)] text-[color:black] p-5">{{$t("common_register")}}</button>
          <input type="checkbox" v-model="rememberMe"><label>Stay signed in</label>
        </div>
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
import BaseInput from '../components/BaseInput.vue'

  export default defineComponent({
    name: "LoginView",
    props: {
    },
    components: {
    BaseCard,
    BaseButton,
    BaseInput
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
    },
  });
</script>