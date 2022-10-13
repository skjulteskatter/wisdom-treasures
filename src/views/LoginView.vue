<template>
  <div class="w-96">
    <BaseCard>
      <template #header>
        <div class="flex justify-center">
          <h1 class="text-lg">Login today!</h1>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col">
          <BaseInput v-model="email" class="p-4 border mt-2">
            <p>Email</p>
          </BaseInput>
          <BaseInput v-model="password" class="p-4 border mt-2">
            <p>Password</p>
            <ClickableLink>Forgot password?</ClickableLink>
          </BaseInput>

          <label class="flex gap-2 mt-4 items-center cursor-pointer">
            <input type="checkbox" v-model="rememberMe" class="rounded border border-gray-500 focus-visible:ring-primary text-primary" />
            <span class="select-none">Stay signed in</span>
          </label>

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

          <!-- This is the "---- or ----" -part of the login 😉-->
          <div class="flex gap-4 mt-4 select-none">
            <div class="grow h-px bg-gray-500 self-center"/>
            <p class="grow-0 text-gray-500 self-center">or</p>
            <div class="grow h-px bg-gray-500 self-center"/>
          </div>
          
          <div class="my-4 flex justify-center">
            <ClickableLink>Create an account</ClickableLink>
          </div>
        
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
import ClickableLink from '../components/ClickableLink.vue'

  export default defineComponent({
    name: "LoginView",
    props: {
    },
    components: {
    BaseCard,
    BaseButton,
    BaseInput,
    ClickableLink
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