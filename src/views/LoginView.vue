<template>
  <div class="col-span-2">
    <BaseCard>
      <template #header>
        <div ref="widening" class="w-96"/>
        <div class="flex justify-center">
          <div>
            <p v-if="!registerViewActive">Login to Your Account</p>
            <p v-else>Create Your Account</p>
          </div>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col">
          <BaseInput v-model="email" class="p-4 border mt-2" :error="!!errors.email" v-on:keydown.enter="login()">
            <p>Email</p>
          </BaseInput>

          <BaseInput v-model="fullName" v-on:keydown.enter="login()" :disabled=!registerViewActive class="p-4 border mt-2 max-h-0 opacity-0" :error="!!errors.fullName" :class="[registerViewActive ? 'smoothOpenInput' : [ !firstAppear ? 'smoothCloseInput' : '']]">
            <p>Full name</p>
          </BaseInput>

          <BaseInput v-model="password" v-on:keydown.enter="login()" class="p-4 border mt-2" :password="true" :error="!!errors.password">
            <p>Password</p>
            <ClickableLink v-if="!registerViewActive" :disabled="loginLoading">Forgot password?</ClickableLink>
          </BaseInput>

          <BaseInput v-model="repeatPassword" v-on:keydown.enter="login()" :disabled=!registerViewActive :password="true" :error="!!errors.password" class="p-4 border mt-2 max-h-0 opacity-0" :class="[registerViewActive ? 'smoothOpenInput' : [!firstAppear ? 'smoothCloseInput' : '']]">
            <p>Repeat password</p>
          </BaseInput>

          <label v-if="!registerViewActive" class="flex gap-2 mt-4 items-center cursor-pointer select-none">
            <input type="checkbox" v-model="rememberMe" class="rounded border border-black/20 focus-visible:ring-primary text-primary"/>
            Stay signed in
          </label>

          <label v-else class="flex gap-2 mt-4 cursor-pointer select-none text-xs font-extrabold text-black/30 text-wrap w-96">
            <input type="checkbox" v-model="recievePromotionalEmails" class="rounded border border-black/20 focus-visible:ring-primary text-primary"/>
            <div>
              Get emails from WisdomTreasures about product updates, news, or events. If you change your mind, you can unsubscribe at any time.
            <ClickableLink @link-clicked="viewPrivacyPolicy" :disabled="loginLoading">Privacy Policy</ClickableLink>
            </div>
          </label>

          <p class="text-xs text-[color:var(--wt-color-error)] mt-4 opacity-0 max-h-0" :class="[errorMessage || keepErrorMessageWhileValidating ? 'smoothOpenError' : [!firstAppear ? 'smoothCloseError' : '']]">
            {{errorMessage}}&nbsp;
          </p>

          <div class="grid grid-cols-1 mt-4">
            <BaseButton 
            :loading="loginLoading"
            @click="login()"  
            theme="primary">
              <div v-if="!registerViewActive && !loginLoading">Sign in</div>
              <div v-else-if="!registerViewActive">Signing in...</div>
              <div v-else-if="!loginLoading">Create Account</div>
              <div v-else>Creating Account...</div>
            </BaseButton>
          </div>

          <div v-if="registerViewActive" class="flex gap-4 mt-4 select-none">
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

          <div v-if="!registerViewActive" class="flex gap-4 mt-4 select-none">
            <div class="grow h-px bg-black/30 self-center"/>
            <p class="grow-0 text-black/30 self-center">or</p>
            <div class="grow h-px bg-black/30 self-center"/>
          </div>
          
          <div class="my-4 flex justify-center flex-row">
              <span v-if="!registerViewActive">
                <ClickableLink @link-clicked="changeForm(true)" :disabled="loginLoading">
                  Create an account
                </ClickableLink>
              </span>
              <span v-else class="flex flex-row">
                <div>Have an account?&nbsp;</div>
                <ClickableLink @link-clicked="changeForm(false)" :disabled="loginLoading">
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
      registerViewActive: false as boolean,
      recievePromotionalEmails: false,
      errors: {email: "", password: "", fullName: ""} as {email: string, password: string, fullName: string},
      keepErrorMessageWhileValidating: false,
      firstAppear: true,
      loginLoading: false,
    }),
    computed: {
      errorMessage() : string{
        if (this.errors.email !== "")
          return this.errors.email;
        
        if (this.errors.fullName !== "")
          return this.errors.fullName;

        if (this.errors.password!== "")
          return this.errors.password;

        return "";
      }
    },
    methods: {
      async login(provider : string | undefined = undefined){

        if (!provider && !(await this.isValidForm())) 
          return;

        this.loginLoading = true;

        try {

          this.errors = {email: "", password: "", fullName: ""}

          if (provider)
            return await loginWithProvider(provider, this.rememberMe);

          if (this.registerViewActive) 
            await this.signup();
          else {
            await loginWithEmailAndPassword(this.email, this.password, this.rememberMe);
          }

        } catch (e: any) {
          this.errors = {email: e, password: " ", fullName: " "};
        }

        this.loginLoading = false;

      },
      async signup(){
        if (!(await this.isValidForm())) return;

        signupWithEmailAndPassword(this.email, this.password);
      },
      viewPrivacyPolicy(){
        //Change recievePromotionalEmails variable because when you click the link, the variable gets changed automatically 😐
        this.recievePromotionalEmails = !this.recievePromotionalEmails;
        console.log("Privacy Policy is not implemented");
      },
      validateEmail(): boolean {
        if (!this.email){
          this.errors.email = "Email is required";
          return false;
        }

        if (!this.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)?.length){ 
          this.errors.email = "Invalid email address";
          return false;
        }
        this.errors.email = "";
        return true;
      },
      validateFullName(): boolean {
        if (!this.fullName && this.registerViewActive){
          this.errors.fullName = "Name is required";
          return false;
        }
        this.errors.fullName = "";
        return true;
      },
      validatePassword(): boolean {
        if (!this.password){
          this.errors.password = "Password is required";
          return false;
        } else if (this.registerViewActive && (this.password != this.repeatPassword)){
          this.errors.password = "Passwords doesn't match";
          return false;
        }
        this.errors.password = "";
        return true;
      },
      async isValidForm(): Promise<boolean> {
        // Make every error empty before recheck. This makes the animation happen again
        if ((this.errors.password + this.errors.email + this.errors.fullName).length > 0){
          this.keepErrorMessageWhileValidating = true;
          this.errors = {email: "", password: "", fullName: ""};
        }
        
        await new Promise(r => setTimeout(r, 0));
        if (!this.validateEmail()) return false;
        if (!this.validateFullName()) return false;
        if (!this.validatePassword()) return false;
        this.keepErrorMessageWhileValidating = false;
        return true;
      },
      changeForm(changeToRegisterForm : boolean) {
        this.firstAppear = false;
        this.errors = {email: "", password: "", fullName: ""};
        this.registerViewActive = changeToRegisterForm;
        this.keepErrorMessageWhileValidating = false;
      },
    },
  });
</script>

<style>

.smoothOpenError{
    animation: smoothOpenError 0.2s both linear;
}

@keyframes smoothOpenError {
  from {
    opacity: 0;
    max-height: 0;
  }

  to {
    opacity: 1;
    max-height: 1em;
  }
}

.smoothCloseError{
    animation: smoothCloseError 0.2s both linear;
}

@keyframes smoothCloseError {
  from {
    opacity: 1;
    max-height: 1em;
  }

  to {
    opacity: 0;
    max-height: 0em;
  }
}

.smoothOpenInput{
    animation: smoothOpenInput 0.35s both linear;
}

@keyframes smoothOpenInput {
  0% {
    opacity: 0;
    max-height: 0;
    transform: translateX(-30%);
  }

  50% {
    opacity: 0;
    max-height: 5em;
    transform: translateX(-30%);
  }

  100% {
    opacity: 1;
    max-height: 5em;
    transform: translateX(0%);
  }
}

.smoothCloseInput{
    animation: smoothCloseInput 0.25s both linear;
}

@keyframes smoothCloseInput {
  from {
    opacity: 1;
    max-height: 5em;
  }

  to {
    opacity: 0;
    max-height: 0em;
  }
}

</style>