<template>
  <div>
    <BaseCard>
      <template #header>
        <div ref="widening" class="w-96"/>
        <div class="flex justify-center">
          <div class="text-2xl">
            <p v-if="!register">Login to Your Account</p>
            <p v-else>Create Your Account</p>
          </div>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col">
          <BaseInput v-model="email" class="p-4 border mt-2" :error="true">
            <p>Email</p>
          </BaseInput>

          <BaseInput v-if="register" v-model="fullName" class="p-4 border mt-2">
            <p>Full name</p>
          </BaseInput>

          <BaseInput v-model="password" class="p-4 border mt-2" :password="true">
            <p>Password</p>
            <ClickableLink v-if="!register">Forgot password?</ClickableLink>
          </BaseInput>

          <BaseInput v-if="register" v-model="repeatPassword" class="p-4 border mt-2" :password="true">
            <p>Repeat password</p>
          </BaseInput>

          <label v-if="!register" class="flex gap-2 mt-4 items-center cursor-pointer select-none">
            <input type="checkbox" v-model="rememberMe" class="rounded border border-black/20 focus-visible:ring-primary text-primary"/>
            Stay signed in
          </label>

          <label v-else class="flex gap-2 mt-4 cursor-pointer select-none text-xs font-extrabold text-black/30 text-wrap w-96">
            <input type="checkbox" v-model="recievePromotionalEmails" class="rounded border border-black/20 focus-visible:ring-primary text-primary"/>
            <div>
              Get emails from WisdomTreasures about product updates, news, or events. If you change your mind, you can unsubscribe at any time.
            <ClickableLink @click="viewPrivacyPolicy" >Privacy Policy</ClickableLink>
            </div>
          </label>

          <p v-if="errorMessage" class="text-xs text-[color:var(--wt-color-error)] mt-4">
            {{errorMessage}}
          </p>

          <div class="grid grid-cols-1 mt-4">
            <BaseButton 
            @click="login()"  
            theme="primary">
              <div v-if="!register">{{$t("common_login")}}</div>
              <div v-else>{{$t("common_register")}}</div>
            </BaseButton>
          </div>

          <div v-if="register" class="flex gap-4 mt-4 select-none">
            <div class="grow h-px bg-black/30 self-center"/>
            <p class="grow-0 text-black/30 self-center">or use a provider</p>
            <div class="grow h-px bg-black/30 self-center"/>
          </div>

          <div class="grid grid-cols-2 mt-4 gap-4">
            <BaseButton
              class="border border-primary" 
              @click="login('google')" theme="tertiary">
              <div class="flex items-center gap-4">
                <img class="w-8 object-contain" src="/img/google.svg"/>
                <b class="align-middle">Google</b>
              </div>
            </BaseButton>

            <BaseButton
              class="border border-primary" 
              @click="login('apple')" theme="tertiary">
              <div class="flex items-center gap-4">
                <img class="w-8 object-contain" src="/img/apple.svg"/>
                <b class="align-middle">Apple</b>
              </div>
            </BaseButton>
          </div>

          <div v-if="!register" class="flex gap-4 mt-4 select-none">
            <div class="grow h-px bg-black/30 self-center"/>
            <p class="grow-0 text-black/30 self-center">or</p>
            <div class="grow h-px bg-black/30 self-center"/>
          </div>
          
          <div class="my-4 flex justify-center flex-row">
              <span v-if="!register">
                <ClickableLink v-on:click="changeForm(true)">
                  Create an account
                </ClickableLink>
              </span>
              <span v-else class="flex flex-row">
                <div>Have an account?&nbsp;</div>
                <ClickableLink v-on:click="changeForm(false)">
                  Sign in
                </ClickableLink>
              </span>
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
    ClickableLink,
},
    data: () => ({
      email: "",
      password: "",
      fullName: "",
      repeatPassword: "",
      rememberMe: false,
      store: useSessionStore(),
      register: false as boolean,
      recievePromotionalEmails: false,
      errorMessage: "",
    }),
    computed: {
    },
    mounted() { 
    },
    methods: {
      async login(provider : string | undefined = undefined){

        if (!this.validate()) return;

        if (provider){
          loginWithProvider(provider, this.rememberMe);
        } else if (this.register) {
          await this.signup();
        } else {
          loginWithEmailAndPassword(this.email, this.password, this.rememberMe);
        }
        
      },
      async signup(){
        if (!this.validate()) return;
        signupWithEmailAndPassword(this.email, this.password);
      },
      viewPrivacyPolicy(){
        //Change recievePromotionalEmails variable because when you click the link, the variable gets changed automatically 😐
        this.recievePromotionalEmails = !this.recievePromotionalEmails;
        console.log("Privacy Policy is not implemented");
      },
      validate(): boolean {
        if (!this.password) this.errorMessage = "Password is required";
        if (!this.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)?.length) this.errorMessage = "Invalid email address";
        if (!this.email) this.errorMessage = "Email is required"
        if (this.errorMessage) return false;
        if (!this.register) return true;
        if (this.password != this.repeatPassword) this.errorMessage = "Passwords must match";
        if (this.errorMessage) return false;
        return true;
      },
      changeForm(changeToRegisterForm : boolean) {
        this.errorMessage = "";
        this.register = changeToRegisterForm;
      }
    },
  });
</script>