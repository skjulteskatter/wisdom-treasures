<template>
  <main>
    <div id="topPart" class="flex bg-primary sm:bg-transparent shadow-md sm:shadow-none items-center justify-between py-4 pr-4">
      <div class="flex">
        <BackButton/>
        <p id="justForLayout" class="hidden sm:block opacity-0 mr-2">{{$t('signIn.logOut')}}</p>
      </div>
      
      <h1 class="text-base sm:text-xl text-white sm:text-inherit tracking-wide font-bold">
      {{$t('common.profile')}}
      </h1>
      <div class="place-self-center">
        <BaseButton theme="wisdomMannaBtn" @click="async () => {await logout()}">
          <template #icon>
            <LogoutIcon class="h-5"/>
          </template>
        </BaseButton>
      </div>
    </div>

    <div class="lg:w-4/5 mr-auto ml-auto">

      <div class="flex flex-col sm:flex-row justify-center items-center pt-14 pb-10 sm:py-10">
        <div class="sm:w-1/2 pb-5 px-10 flex justify-end">
          <img :src="currentUser?.photoURL || '/img/user.svg'" class="h-44 rounded-full"/>
        </div>
        <div class="flex flex-col justify-center sm:justify-start sm:w-1/2 pt-5 sm:px-10 border-t-2 sm:border-t-0 sm:border-l-2 border-[color:var(--wt-color-secondary-light)]">
          <h1 class="text-4xl font-bold font-sans">
            {{getFullName}}
          </h1>
          <p class="text-sm font-sans opacity-70 mt-1">
            {{getEmail}}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-10">
        <GenerelDropDown :input-map="validLangs" :initial-value="validLangs.get(store.locale) ?? fallbackLang" @value-clicked:chosen-value="setSelectedLanguage" :profileLanguage="true"></GenerelDropDown>
        <BaseButton theme="settings" @click="()=>{$router.push({name: 'store'})}">
          {{$t('profile.buySubscription')}}
          <template #firstIcon>
            <CreditCardIcon class="h-5 opacity-80"></CreditCardIcon>
          </template>
        </BaseButton>
        <BaseButton theme="settings" @click="goToManageSubscriptions()">
          {{$t('profile.manageSubscription')}}
          <template #firstIcon>
            <CurrencyDollarIcon class="h-5 opacity-80"></CurrencyDollarIcon>
          </template>
        </BaseButton>
        <BaseButton theme='settings' @click="showPasswordModal = true">
          {{$t('signIn.passwordChange')}}
          <template #firstIcon>
            <KeyIcon class="h-5 opacity-80"></KeyIcon>
          </template>
        </BaseButton>
        <BaseButton @click="sendEmail" theme="settings">
          {{$t('profile.contactSupport')}}:&nbsp;<ClickableLink>{{ supportEmail }}</ClickableLink>
        </BaseButton>
      </div>

      <div class="flex mt-8 pb-5  sm:pr-5 w-full space-x-4 justify-center">
        <BaseButton theme='threeDBtn' :loading="loadingLanguage" @click="async ()=> {await saveLocalSettings()}">
          {{$t('profile.saveSetting')}}
          <template #icon>
            <SaveIcon class="h-5"></SaveIcon>
          </template>
        </BaseButton>
        <BaseButton theme="threeDBtn" @click="async () => {await logout()}">
          {{$t('common.logOut')}}
          <template #icon>
            <LogoutIcon class="h-5"/>
          </template>
        </BaseButton>
      </div>

      <!-- <div class="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#eaeaea] opacity-60 w-11/12 sm:w-full h-5/6 -z-10 rounded-t-5xl"></div> -->
      <ChangePasswordModal :show="showPasswordModal" @close="()=> {showPasswordModal = false}"/>
    </div>
    <img id="add-bg" class="sm:hidden fixed top-0 left-0 store-card-width -z-50" src="../../images/add-bg.png"/>
  </main>
</template>

<script lang="ts">
import { getCurrentUserPromise, userLoggedInCallback } from '@/services/auth';
import { useSessionStore } from '@/stores/session';
import { defineComponent } from 'vue';
import type { User } from "firebase/auth";
import BaseButton from '@/components/BaseButton.vue';
import BackButton from '@/components/BackButton.vue';
import { KeyIcon, SaveIcon, LogoutIcon, CreditCardIcon, CurrencyDollarIcon } from '@heroicons/vue/outline';
import GenerelDropDown from '@/components/GenerelDropDown.vue';
import { validLanguages, fallbackLocale } from '@/i18n';
import ChangePasswordModal from '@/components/Profile/ChangePasswordModal.vue';
import { InlineNotification } from "@/classes/notification";
import ClickableLink from '@/components/ClickableLink.vue';
import { logOut } from "@/services/auth";
import { STRIPE_MANAGE_LINK } from '@/stores/session';

  export default defineComponent({
    name: "ProfileView",
    data() {
      return {
        currentUser: null as User | null,
        store: useSessionStore(),
        validLangs: validLanguages as Map<string, string>,
        fallbackLang: fallbackLocale as string,
        displayName: "" as string,
        showPasswordModal: false,
        selectedLanguage: "" as string,
        supportEmail: "support@wisdomtreasures.no" as string,
        loadingLanguage: false as boolean,
      }
    },
    props: {
    },
      components: {
      BaseButton,
      KeyIcon,
      GenerelDropDown,
      SaveIcon,
      ChangePasswordModal,
      ClickableLink,
      LogoutIcon,
      CreditCardIcon,
      CurrencyDollarIcon,
      BackButton
    },
    computed: {
      initialized(){
        return this.store.sessionInitialized;
      },
      getFullName() : string{
        return this.currentUser?.displayName ?? "";
      },
      getEmail(): string{
        return this.currentUser?.email ?? "";
      }
    },
    watch: {
      async initialized(newValue){
        if (newValue){
          await this.setCurrentUser();
        }
      }
    },
    methods: {
      async setCurrentUser(){
        this.currentUser = await getCurrentUserPromise();
      },
      goToManageSubscriptions(){
        window.location.href = STRIPE_MANAGE_LINK;
      },
      async changeLanguage(newLanguage : string){
        if (this.store.locale == newLanguage) return;
        this.store.setLocale(newLanguage);
        await userLoggedInCallback(newLanguage);
      },
      setSelectedLanguage(language: string){
        this.selectedLanguage = language;
      },
      async saveLocalSettings(): Promise<void> {
        this.loadingLanguage = true;
        await this.changeLanguage(this.selectedLanguage);
        this.store.notifications.push(new InlineNotification(this.$t('profile.settingUpdatedMsg')));
        this.loadingLanguage = false;
      },
      async logout(){
        await logOut();
        this.$router.push({name: "dashboard"});
      },
      sendEmail(){
        window.location.href = "mailto:" + this.supportEmail;
      }
    },
    mounted() {
      if (this.initialized)
        this.setCurrentUser();
    }
  });
</script>
<style>
.rounded-t-5xl{
  border-top-left-radius: 3rem;
  border-top-right-radius: 3rem
}
</style>