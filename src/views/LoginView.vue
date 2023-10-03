<template>
  <main class="bg-white col-span-2 min-h-full w-full lg:flex place-items-center flex-col">
    <span id="LogoAndLetters" class="grow basis-0 w-auto lg:w-[26rem] p-4 lg:p-0 border-black/20 flex justify-center">
      <div class="flex place-items-center max-h-20 mt-8 mb-5">
        <img class="w-14 h-14 mr-2" src="/img/logo.svg"/>
        <span class="text-base pl-2 pt-1 text-primary font-bold tracking-wide">Wisdom<div class="text-[color:var(--wt-color-text-lm)] font-bold -mt-1">Treasures</div></span>
      </div>
      <!-- <div id="thisIsJustForSpacing" class="grow"/> -->
    </span>
    <BaseCard class="mx-auto rounded-none lg:rounded-md lg:max-w-sm lg:w-96 shadow-none">
      <template #header>
        <div class="font-sans flex justify-center items-center">
          <div>
            <div v-if="include([forms.login])">
              <p class="font-bold" v-if="store.redirectAfterLoginName == 'profile'">{{$t('signIn.logInMsg')}}</p>
              <p class="font-bold" v-else-if="store.redirectAfterLoginName == 'store'">{{$t('signIn.logInStoreMsg')}}</p>
              <div v-else class="flex flex-col items-center">
              <p class="font-bold" >{{ $t('signIn.logIn') }}</p>
              <p class="text-xs">  {{ $t('signIn.logInInfo') }}</p>
            </div>
            </div>
            <p class="font-bold" v-else-if="include([forms.register])">{{$t('signIn.createAccountMsg')}}</p>
            <p class="font-bold" v-else>{{$t('signIn.resetPasswordMsg')}}</p>
          </div>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col">
          <BaseInput v-model="email" class="lg:px-0 border mt-2 small:mx-4" :error="!!errors.email" v-on:keydown.enter="action()">
            <p>{{ $t('common.Email') }}</p>
          </BaseInput>

          <BaseInput v-model="fullName" v-on:keydown.enter="action()" :disabled=include([forms.login,forms.forgotPassword]) class=" lg:px-0 border mt-6 small:mx-4 max-h-0 opacity-0" 
            :error="!!errors.fullName" :class="[include([forms.register]) ? 'smoothOpenInput' : [ registerFormLoaded ? 'smoothCloseInput' : '']]">
            <p>{{ $t('signIn.fullName') }}</p>
          </BaseInput>

          <BaseInput v-model="password" v-on:keydown.enter="action()" :disabled=include([forms.forgotPassword]) class=" lg:px-0 border mt-6 small:mx-4" style-type="password" :error="!!errors.password" 
            :class="[include([forms.register, forms.login]) ? [ forgotPasswordFormLoaded ? 'smoothOpenInput' : ''] : [ forgotPasswordFormLoaded ? 'smoothCloseInput' : '']]">
            <p>{{ $t('common.password') }}</p>
            <ClickableLink v-if="include([forms.login])" :disabled="actionLoading" v-on:click="changeForm('forgotPassword')">{{ $t('signIn.forgotPasswordQst') }}</ClickableLink>
          </BaseInput>

          <BaseInput v-model="repeatPassword" v-on:keydown.enter="action()" :disabled=include([forms.login,forms.forgotPassword]) style-type="password" :error="!!errors.password" 
            class="lg:px-0 border mt-6 small:mx-4 max-h-0 opacity-0" 
            :class="[include([forms.register]) ? 'smoothOpenInput' : [registerFormLoaded ? 'smoothCloseInput' : '']]">
            <p>{{ $t('signIn.repeatPassword') }}</p>
          </BaseInput>

          <label v-if="include([forms.login])" class="flex gap-2 mt-4 items-center cursor-pointer select-none">
            <BaseCheckbox v-model="rememberMe"/>
            {{ $t('signIn.staySignedIn') }}
          </label>

          <!--TODO fix the error message box getting to big for the card-->
          <span v-if="include([forms.register])" class="flex gap-2 mt-4 cursor-pointer select-none text-xs font-extrabold text-black/30 text-wrap lg:w-96">
            <BaseCheckbox v-model="agreeTerms" :error="!!errors.terms"/>
            <span :class="[{'text-[color:var(--wt-color-error)]' : !!errors.terms}]">
              {{ $t('signIn.iAgree') }}
              <ClickableLink class="inline-block" @link-clicked="showTermsModal = true" :disabled="actionLoading">{{ $t('common.tos') }}</ClickableLink>
            </span>
          </span>
          <TermsModal :show="showTermsModal" @close="showTermsModal = false"></TermsModal>

          <!--
          <span v-if="include([forms.register])" class="flex gap-2 mt-4 cursor-pointer select-none text-xs font-extrabold text-black/30 text-wrap lg:w-96">
            <BaseCheckbox v-model="recievePromotionalEmails"/>
            <span>
              Get emails from WisdomTreasures about product updates, news, or events. If you change your mind, you can unsubscribe at any time.
              <ClickableLink class="inline-block" @link-clicked="viewPrivacyPolicy" :disabled="actionLoading">View Privacy Policy</ClickableLink>
            </span>
          </span>
          -->

          <p class="text-[color:var(--wt-color-error)] opacity-0 max-h-0 text-wrap w-full rounded-md bg-red-100 px-2" 
            :class="{'text-[color:var(--wt-color-success)] bg-green-100' : successMessage, 'smoothOpenError' : errorMessage || successMessage || keepErrorMessageWhileValidating, 'smoothCloseError' : (!successMessage && !errorMessage && !keepErrorMessageWhileValidating) && errorSuccessMessageLoaded}">
            {{successMessage || errorMessage}}&nbsp;
          </p>

          <div class="grid grid-cols-1 mt-4">
            <BaseButton 
            :loading="actionLoading"
            @click="action()"  
            theme="threeDBtn">
              <div v-if="include([forms.login]) && !actionLoading">{{ $t('signIn.logIn') }}</div>
              <div v-else-if="include([forms.login])">{{ $t('signIn.signingIn') }}.</div>
              <div v-else-if="include([forms.register]) && !actionLoading">{{ $t('signIn.createAccount') }}</div>
              <div v-else-if="include([forms.register])">{{ $t('signIn.creatingAccount') }}</div>
              <div v-else-if="include([forms.forgotPassword]) && !actionLoading">{{ $t('signIn.resetPassword') }}</div>
              <div v-else-if="include([forms.forgotPassword])">{{ $t('signIn.resettingPassword') }}</div>
            </BaseButton>
          </div>

          <div v-if="include([forms.register])" class="flex gap-4 mt-4 select-none">
            <div class="grow h-px bg-black/30 self-center"/>
            <p class="grow-0 text-black/30 self-center">{{$t('signIn.providerMsg')}}</p>
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
                  {{$t('signIn.createAccount')}}
                </ClickableLink>
              </span>
              <span v-else-if="include([forms.register])" class="flex flex-row">
                <div>{{$t('signIn.haveAccountQst')}}&nbsp;</div>
                <ClickableLink @link-clicked="changeForm('login')" :disabled="actionLoading">
                  {{$t('signIn.logIn')}}
                </ClickableLink>
              </span>
              <span v-else class="flex flex-row">
                <ClickableLink @link-clicked="changeForm('login')" :disabled="actionLoading">
                  {{$t('signIn.returnSignIn')}}
                </ClickableLink>
              </span>
          </div>
        </div>
      </template>
    </BaseCard>
    <div class="grow basis-0 border-black/20 w-auto lg:w-[26rem] flex flex-col">
      <div id="justForSpacingPurposes" class="grow"/>
      <FooterComponent/>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { loginWithEmailAndPassword, signupWithEmailAndPassword, loginWithProvider, auth} from '@/services/auth';
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import ClickableLink from '../components/ClickableLink.vue'
import api from '../services/api'
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import { useSessionStore } from '@/stores/session';
import FooterComponent from '@/components/FooterComponent.vue';
import TermsModal from '@/components/TermsModal.vue';
import type { User } from 'firebase/auth';

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
    FooterComponent,
    TermsModal
},
    data: () => ({
      email: "",
      password: "",
      fullName: "",
      repeatPassword: "",
      rememberMe: false,
      currentForm: "login" as "login" | "register" | "forgotPassword",
      recievePromotionalEmails: false,
      agreeTerms: false,
      errors: {email: "", password: "", fullName: "", terms: ""} as {email: string, password: string, fullName: string, terms: string},
      keepErrorMessageWhileValidating: false,

      registerFormLoaded: false,
      forgotPasswordFormLoaded: false,
      errorSuccessMessageLoaded: false,
      
      actionLoading: false,
      successMessage: "",

      forms: {login: "login" as "login", register: "register" as "register", forgotPassword: "forgotPassword" as "forgotPassword"} ,

      store: useSessionStore(),

      showTermsModal: false,
    }),
    computed: {
      errorMessage() : string{

        //TODO find a better way to do this
        if (this.errors.email !== "")
          return this.errors.email;
        
        if (this.errors.fullName !== "")
          return this.errors.fullName;

        if (this.errors.password!== "")
          return this.errors.password;

        if (this.errors.terms!== "")
          return this.errors.terms;

        return "";
      },
      currentUser() : User | null {
        return auth.currentUser
      }
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

          this.errors = {email: "", password: "", fullName: "", terms: "",}

          if (provider)
            return await loginWithProvider(provider, this.rememberMe);

          if (this.include([this.forms.register])) 
          {
            await this.signup();
            this.successMessage = this.$t('signIn.createdAccountSuccessMsg') + this.email;
            this.changeForm(this.forms.login);
          }
          else if (this.include([this.forms.login])) 
          {
            if (!await loginWithEmailAndPassword(this.email, this.password, this.rememberMe))
              throw new Error(this.$t('signIn.emailNotVerifiedMsg'));
            
          } else 
          {
            try {
              await api.session.resetPassword(this.email);
            } catch (e: any){
              console.log("Didn't go as planned: ", e);
              throw new Error(e.error);
            }
            console.log("Went as planned");
            this.successMessage = this.$t('signIn.passwordResetMsg') + this.email;
            this.changeForm(this.forms.login);
          }

        } catch (e: any) {
          //Use email field as general purpose error message because it gets checked and displayed first.
          this.errors = {email: e.toString(), password: " ", fullName: " ", terms: " ",};
        }

        this.actionLoading = false;
      },
      async signup(){
        if (!(await this.isValidForm())) return;
        await signupWithEmailAndPassword(this.email, this.password);
      },
      viewPrivacyPolicy(){
        this.$router.push({name: "terms"});
      },
      validateEmail(): boolean {
        if (!this.email){
          this.errors.email =this.$t('signIn.emailRequiredMsg');
          return false;
        }

        if (!this.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)?.length){ 
          this.errors.email = this.$t('signIn.invalidEmailMsg');
          return false;
        }

        return true;
      },
      validateFullName(): boolean {

        if (this.include([this.forms.login, this.forms.forgotPassword]))
          return true;

        if (!this.fullName){
          this.errors.fullName = this.$t('signIn.nameRequiredMsg');
          return false;
        }

        return true;
      },
      validateTerms(): boolean {

        if (this.include([this.forms.login, this.forms.forgotPassword]))
          return true;

        if (!this.agreeTerms){
          this.errors.terms =  this.$t('signIn.tosMsg') ;
          return false;
        }

        return true;
      },
      validatePassword(): boolean {

        if (this.include([this.forms.forgotPassword]))
          return true;

        if (!this.password){
          this.errors.password =  this.$t('signIn.passwordRequiredMsg');
          return false;
        } else if (this.password != this.repeatPassword && this.include([this.forms.register])){
          this.errors.password = this.$t('signIn.passwordDontMatchMsg');
          return false;
        }

        return true;
      },
      async isValidForm(): Promise<boolean> {
        // Make every error empty before recheck. This makes the animation happen again
        if ((this.errors.password + this.errors.email + this.errors.fullName + this.errors.terms).length > 0){
          this.keepErrorMessageWhileValidating = true;
          this.errors = {email: "", password: "", fullName: "", terms: ""};
        }
        
        await new Promise(r => setTimeout(r, 0));
        if (!this.validateEmail()) return false;
        if (!this.validateFullName()) return false;
        if (!this.validatePassword()) return false;
        if (!this.validateTerms()) return false;
        this.keepErrorMessageWhileValidating = false;
        return true;
      },
      changeForm(form : "login" | "register" | "forgotPassword") {
        this.keepErrorMessageWhileValidating = false;
        this.registerFormLoaded = this.registerFormLoaded || form == this.forms.register;
        this.forgotPasswordFormLoaded = this.forgotPasswordFormLoaded || form == this.forms.forgotPassword;
        this.errors = {email: "", password: "", fullName: "", terms: ""};
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