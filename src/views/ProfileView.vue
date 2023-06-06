<template>
  <main>
    <div id="topPart" class="flex bg-primary sm:bg-transparent shadow-md sm:shadow-none items-center justify-between py-4 sm:py-6">
      <div class="flex">
        <BackButton/>
        <p id="justForLayout" class="hidden sm:block opacity-0 mr-2">Log out</p>
      </div>
      
      <h1 class="text-base sm:text-3xl text-white sm:text-inherit tracking-wide font-bold">
      {{$t('common.profile')}}
      </h1>
      <div class="place-self-center">
        <BaseButton @click="async () => {await logout()}">
          <p class="hidden sm:block ">{{$t('signIn.logOut')}}</p>
          <template #icon>
            <LogoutIcon class="h-5"/>
          </template>
        </BaseButton>
      </div>
    </div>

    <div>
      
        
          <div class="flex flex-col place-items-center font-sans py-10">
            <img :src="currentUser?.photoURL || '/img/user.svg'" class="h-28 rounded-full"/>
            <div class="flex flex-col items-center">
              <!-- <h1 class="text-2xl font-bold font-sans mt-3">
                {{getFullName}}
              </h1> -->
              <div class="flex justify-center items-center">
                <BaseInput :model-value="displayName" :placeholder="getFullName" :nameInput="true"></BaseInput>
              </div>
              <p class="text-sm font-sans ">
                {{getEmail}}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 px-10">
            <GenerelDropDown :input-map="validLangs" :initial-value="validLangs.get(store.locale) ?? fallbackLang" @value-clicked:chosen-value="setSelectedLanguage" :profileLanguage="true"></GenerelDropDown>
            <BaseButton theme="noBg" @click="()=>{$router.push({name: 'store'})}">
              {{$t('profile.buySubscription')}}
              <template #firstIcon>
                <CreditCardIcon class="h-5 opacity-80"></CreditCardIcon>
              </template>
            </BaseButton>
            <BaseButton theme="noBg" @click="goToManageSubscriptions()">
              Manage Subscription
              <template #firstIcon>
                <CurrencyDollarIcon class="h-5 opacity-80"></CurrencyDollarIcon>
              </template>
            </BaseButton>
            <BaseButton theme='noBg' @click="showPasswordModal = true">
              Change password
              <template #firstIcon>
                <KeyIcon class="h-5 opacity-80"></KeyIcon>
              </template>
            </BaseButton>
            <BaseButton @click="sendEmail" theme="noBg">
              Contact:&nbsp;<ClickableLink>{{ supportEmail }}</ClickableLink>
            </BaseButton>
          </div>

          <div class="flex mt-8 pb-5 pr-10 sm:pr-5 w-full place-content-end">
            <BaseButton theme='primary' @click="async ()=> {await saveLocalSettings()}">
              {{$t('profile.saveSetting')}}
              <template #icon>
                <SaveIcon class="h-5"></SaveIcon>
              </template>
            </BaseButton>
          </div>

          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/10 opacity-40 w-11/12 sm:w-full h-5/6 -z-10 rounded-t-5xl"></div>
      <ChangePasswordModal :show="showPasswordModal" @close="()=> {showPasswordModal = false}"/>
    </div>
  </main>
</template>

<script lang="ts">
import { auth, getCurrentUserPromise } from '@/services/auth';
import { useSessionStore } from '@/stores/session';
import { defineComponent } from 'vue';
import type { User } from "firebase/auth";
import BaseCard from '@/components/BaseCard.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BackButton from '@/components/BackButton.vue';
import { KeyIcon, SaveIcon, LogoutIcon, CreditCardIcon, CurrencyDollarIcon } from '@heroicons/vue/outline';
import GenerelDropDown from '@/components/GenerelDropDown.vue';
import { validLanguages, fallbackLocale } from '@/i18n';
import ChangePasswordModal from '@/components/ChangePasswordModal.vue';
import { Notification } from "@/classes/notification";
import ClickableLink from '@/components/ClickableLink.vue';
import { logOut } from "@/services/auth";

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
      }
    },
    props: {
    },
      components: {
      BaseCard,
      BaseInput,
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
        window.location.href = 'https://billing.stripe.com/p/login/aEUaG25ag6bybEA3cc';
      },
      changeLanguage(newLanguage : string){
        if (this.store.locale == newLanguage) return;
        this.store.setLocale(newLanguage);
      },
      setSelectedLanguage(language: string){
        this.selectedLanguage = language;
      },
      async saveLocalSettings(): Promise<void> {
        this.changeLanguage(this.selectedLanguage);
        this.store.notifications.push(new Notification(this.$t('profile.settingUpdatedMsg')));
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