<template>
  <main class="col-span-2 w-full h-full lg:flex place-items-center flex-col">
    <span id="LogoAndLetters" class="grow basis-0 w-auto lg:w-[26rem] p-4 lg:p-0 border-l border-dashed border-black/20 flex">
      <div class="cursor-pointer flex place-items-center max-h-20" @mouseover="()=>{hoverOverWTLogo = true}" @mouseleave="()=>{hoverOverWTLogo = false}" @click="() => {$router.push({name: 'dashboard'})}">
        <img class="w-14 h-14 cursor-pointer" src="/img/logo.svg"/>
        <span class="text-2xl pb-2 font-bold">Wisdom<div class="text-primary inline-block font-bold">Treasures</div></span>
        <ArrowRightIcon class="w-6 ml-1 opacity-0" :class="[{'arrowAppear': hoverOverWTLogo, 'arrowDisAppear' : hoverOverWTLogo === false}]"/>
      </div>
      <div id="thisIsJustForSpacing" class="grow"/>
    </span>
    <BaseCard class="mx-auto rounded-none lg:rounded-md">
      <template #header>
        <div ref="widening" class="w-auto lg:w-96"/>
        <div class="flex justify-center my-2">
          <div>
            <p v-if="include([forms.login])">Login to your account</p>
            <p v-else-if="include([forms.register])">Create your account</p>
            <p v-else>Reset your password</p>
          </div>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col">
          <BaseInput v-model="email" class="p-4 border mt-2" :error="!!errors.email" v-on:keydown.enter="action()">
            <p>Email</p>
          </BaseInput>

          <BaseInput v-model="fullName" v-on:keydown.enter="action()" :disabled=include([forms.login,forms.forgotPassword]) class="p-4 border mt-2 max-h-0 opacity-0" 
            :error="!!errors.fullName" :class="[include([forms.register]) ? 'smoothOpenInput' : [ registerFormLoaded ? 'smoothCloseInput' : '']]">
            <p>Full name</p>
          </BaseInput>

          <BaseInput v-model="password" v-on:keydown.enter="action()" :disabled=include([forms.forgotPassword]) class="p-4 border mt-2" style-type="password" :error="!!errors.password" 
            :class="[include([forms.register, forms.login]) ? [ forgotPasswordFormLoaded ? 'smoothOpenInput' : ''] : [ forgotPasswordFormLoaded ? 'smoothCloseInput' : '']]">
            <p>Password</p>
            <ClickableLink v-if="include([forms.login])" :disabled="actionLoading" v-on:click="changeForm('forgotPassword')">Forgot password?</ClickableLink>
          </BaseInput>

          <BaseInput v-model="repeatPassword" v-on:keydown.enter="action()" :disabled=include([forms.login,forms.forgotPassword]) style-type="password" :error="!!errors.password" 
            class="p-4 border mt-2 max-h-0 opacity-0" 
            :class="[include([forms.register]) ? 'smoothOpenInput' : [registerFormLoaded ? 'smoothCloseInput' : '']]">
            <p>Repeat password</p>
          </BaseInput>

          <label v-if="include([forms.login])" class="flex gap-2 mt-4 items-center cursor-pointer select-none">
            <BaseCheckbox v-model="rememberMe"/>
            Stay signed in
          </label>

          <span v-if="include([forms.register])" class="flex gap-2 mt-4 cursor-pointer select-none text-xs font-extrabold text-black/30 text-wrap lg:w-96">
            <BaseCheckbox v-model="recievePromotionalEmails"/>
            <span>
              Get emails from WisdomTreasures about product updates, news, or events. If you change your mind, you can unsubscribe at any time.
              <ClickableLink @link-clicked="viewPrivacyPolicy" :disabled="actionLoading">Privacy Policy</ClickableLink>
            </span>
          </span>

          <p class="text-[color:var(--wt-color-error)] opacity-0 max-h-0 text-wrap w-full rounded-md bg-red-100 px-2" 
            :class="{'text-[color:var(--wt-color-success)] bg-green-100' : successMessage, 'smoothOpenError' : errorMessage || successMessage || keepErrorMessageWhileValidating, 'smoothCloseError' : (!successMessage && !errorMessage && !keepErrorMessageWhileValidating) && errorSuccessMessageLoaded}">
            {{successMessage || errorMessage}}&nbsp;
          </p>

          <div class="grid grid-cols-1 mt-4">
            <BaseButton 
            :loading="actionLoading"
            @click="action()"  
            theme="primary">
              <div v-if="include([forms.login]) && !actionLoading">Sign in</div>
              <div v-else-if="include([forms.login])">Signing in...</div>
              <div v-else-if="include([forms.register]) && !actionLoading">Create Account</div>
              <div v-else-if="include([forms.register])">Creating Account...</div>
              <div v-else-if="include([forms.forgotPassword]) && !actionLoading">Reset Password</div>
              <div v-else-if="include([forms.forgotPassword])">Resetting Password...</div>
            </BaseButton>
          </div>

          <div v-if="include([forms.register])" class="flex gap-4 mt-4 select-none">
            <div class="grow h-px bg-black/30 self-center"/>
            <p class="grow-0 text-black/30 self-center">or use a provider</p>
            <div class="grow h-px bg-black/30 self-center"/>
          </div>

          <div class="grid grid-cols-2 mt-2 gap-4" :class="[include([forms.register,forms.login]) ? [ forgotPasswordFormLoaded ? 'smoothOpenInput' : ''] : 'smoothCloseInput']">
            <BaseButton
              class="border border-primary mt-2" 
              :disabled=include([forms.forgotPassword])
              :class="[include([forms.register,forms.login]) ? [ forgotPasswordFormLoaded ? 'smoothOpenInput' : ''] : 'smoothCloseInput']"
              @click="action('google')" theme="tertiary">
              <div class="flex items-center gap-4">
                <img class="w-8 object-contain" src="/img/google.svg"/>
                <b class="align-middle">Google</b>
              </div>
            </BaseButton>

            <BaseButton
              class="border border-primary mt-2" 
              :class="[include([forms.register,forms.login]) ? [ forgotPasswordFormLoaded ? 'smoothOpenInput' : ''] : 'smoothCloseInput']"
              :disabled=include([forms.forgotPassword])
              @click="action('apple')" theme="tertiary">
              <div class="flex items-center gap-4">
                <img class="w-8 object-contain" src="/img/apple.svg"/>
                <b class="align-middle">Apple</b>
              </div>
            </BaseButton>
          </div>

          <div v-if="include([forms.login])" class="flex gap-4 mt-4 select-none">
            <div class="grow h-px bg-black/30 self-center"/>
            <p class="grow-0 text-black/30 self-center">or</p>
            <div class="grow h-px bg-black/30 self-center"/>
          </div>
          
          <div class="my-4 flex justify-center flex-row">
              <span v-if="include([forms.login])">
                <ClickableLink @link-clicked="changeForm('register')" :disabled="actionLoading">
                  Create an account
                </ClickableLink>
              </span>
              <span v-else-if="include([forms.register])" class="flex flex-row">
                <div>Have an account?&nbsp;</div>
                <ClickableLink @link-clicked="changeForm('login')" :disabled="actionLoading">
                  Sign in
                </ClickableLink>
              </span>
              <span v-else class="flex flex-row">
                <ClickableLink @link-clicked="changeForm('login')" :disabled="actionLoading">
                  Return to sign in
                </ClickableLink>
              </span>
          </div>
        </div>
      </template>
    </BaseCard>
    <div id="jusrForSpacingPurposes" class="grow border-r basis-0 border-black/20 border-dashed w-[26rem]"></div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { loginWithEmailAndPassword, signupWithEmailAndPassword, loginWithProvider} from '@/services/auth';
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import ClickableLink from '../components/ClickableLink.vue'
import api from '../services/api'
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import { useSessionStore } from '@/stores/session';
import { ArrowRightIcon } from '@heroicons/vue/outline';

  export default defineComponent({
    name: "LoginView",
    props: {
    },
      components: {
      BaseCard,
      BaseButton,
      BaseInput,
      ClickableLink,
      BaseCheckbox,
      ArrowRightIcon,
    },
    data: () => ({
      email: "",
      password: "",
      fullName: "",
      repeatPassword: "",
      rememberMe: false,
      currentForm: "login" as "login" | "register" | "forgotPassword",
      recievePromotionalEmails: false,
      errors: {email: "", password: "", fullName: ""} as {email: string, password: string, fullName: string},
      keepErrorMessageWhileValidating: false,
      hoverOverWTLogo: undefined as boolean | undefined,

      registerFormLoaded: false,
      forgotPasswordFormLoaded: false,
      errorSuccessMessageLoaded: false,
      
      actionLoading: false,
      successMessage: "",

      forms: {login: "login" as "login", register: "register" as "register", forgotPassword: "forgotPassword" as "forgotPassword"} ,

      store: useSessionStore(),
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
      },
    },
    watch: {
      successMessage(newValue : string) {
        if (newValue.length > 0){
          this.errorSuccessMessageLoaded = true;
        }
      },
      errorMessage(newValue : string) {
        if (newValue.length > 0){
          this.errorSuccessMessageLoaded = true;
          this.successMessage = "";
        }
      },
    },
    mounted(){
      if (this.currentForm !== this.store.loginFormBridge){
        this.currentForm = this.store.loginFormBridge;
        this.store.loginFormBridge = "login";
        if (this.currentForm === "register") this.registerFormLoaded = true;
        if (this.currentForm === "forgotPassword") this.forgotPasswordFormLoaded = true;
      }
    },
    methods: {
      async action(provider : string | undefined = undefined){

        if (!provider && !(await this.isValidForm())) 
          return;

        this.actionLoading = true;

        try {

          this.errors = {email: "", password: "", fullName: ""}

          if (provider)
            return await loginWithProvider(provider, this.rememberMe);

          if (this.include([this.forms.register])) 
          {
            await this.signup();
            this.successMessage = "Account created successfully. A verification email was sent to " + this.email;
            this.changeForm(this.forms.login);
          }
          else if (this.include([this.forms.login])) 
          {
            if (!await loginWithEmailAndPassword(this.email, this.password, this.rememberMe))
              throw new Error("Email not verified");
            
          } else 
          {
            try {
              await api.session.resetPassword(this.email);
            } catch (e: any){
              throw new Error(e.error);
            }
            this.successMessage = "Password was reset successfully. The new password was sent to " + this.email;
            this.changeForm(this.forms.login);
          }

        } catch (e: any) {
          //Use email field as general purpose error message because it gets checked and displayed first.
          this.errors = {email: e.toString(), password: " ", fullName: " "};
        }

        this.actionLoading = false;
      },
      async signup(){
        if (!(await this.isValidForm())) return;
        await signupWithEmailAndPassword(this.email, this.password);
      },
      viewPrivacyPolicy(){
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

        return true;
      },
      validateFullName(): boolean {

        if (this.include([this.forms.login, this.forms.forgotPassword]))
          return true;

        if (!this.fullName){
          this.errors.fullName = "Name is required";
          return false;
        }

        return true;
      },
      validatePassword(): boolean {

        if (this.include([this.forms.forgotPassword]))
          return true;

        if (!this.password){
          this.errors.password = "Password is required";
          return false;
        } else if (this.password != this.repeatPassword && this.include([this.forms.register])){
          this.errors.password = "Passwords doesn't match";
          return false;
        }

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
      changeForm(form : "login" | "register" | "forgotPassword") {
        this.keepErrorMessageWhileValidating = false;
        this.registerFormLoaded = this.registerFormLoaded || form == this.forms.register;
        this.forgotPasswordFormLoaded = this.forgotPasswordFormLoaded || form == this.forms.forgotPassword;
        this.errors = {email: "", password: "", fullName: ""};
        this.currentForm = form;
      },
      include(forms : ("login" | "register" | "forgotPassword")[]) {
        return forms.includes(this.currentForm);
      },
    },
  });
</script>

<style scoped>

.smoothOpenError{
    animation: smoothOpenError 0.35s both linear;
}

@keyframes smoothOpenError {
  0% {
    opacity: 0;
    max-height: 0;
    padding-top: 0rem;
    padding-bottom: 0rem;
    margin-top: 0rem;
  }

  50% {
    opacity: 1;
    max-height: 3rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-top: 1rem;
  }

  100% {
    opacity: 1;
    max-height: 6rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-top: 1rem;
  }
}

.smoothCloseError{
    animation: smoothCloseError 0.25s both linear;
}

@keyframes smoothCloseError {
  0% {
    opacity: 1;
    max-height: 6rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-top: 1rem;
  }

  100% {
    opacity: 0;
    max-height: 0;
    padding-top: 0rem;
    padding-bottom: 0rem;
    margin-top: 0rem;
  }
}

.smoothOpenInput{
    animation: smoothOpenInput 0.35s both linear;
    margin-top: 0.5rem;
}

@keyframes smoothOpenInput {
  0% {
    opacity: 0;
    max-height: 0;
    transform: translateX(-30%);
  }

  50% {
    opacity: 0;
    max-height: 6em;
    transform: translateX(-30%);
  }

  100% {
    opacity: 1;
    max-height: 6em;
    transform: translateX(0%);
  }
}

.smoothCloseInput{
    animation: smoothCloseInput 0.25s both linear;
    margin-top: 0rem;
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

.arrowAppear{
    animation: smoothArrowAppear 0.2s both linear;
}

@keyframes smoothArrowAppear {
  0% {
    opacity: 0;
    transform: translateX(-50%);
  }

  100% {
    opacity: 1;
    transform: translateX(0%);
  }
}

.arrowDisAppear{
    animation: smoothArrowDisAppear 0.2s both linear;
}

@keyframes smoothArrowDisAppear {
  0% {
    opacity: 1;
    transform: translateX(0%);
  }

  100% {
    opacity: 0;
    transform: translateX(50%);
  }
}


</style>