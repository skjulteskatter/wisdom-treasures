<template>
  <main>
    <div id="topPart" class="flex align-middle my-6">
      <h1 class="text-3xl font-bold">
      Profile
      </h1>
      <div id="spacerDiv" class="grow"/>
      <div class="place-self-center">
        <BaseButton theme='error' @click="async () => {await logout()}">
        Log Out
        <template #icon>
          <LogoutIcon class="h-5"/>
        </template>
      </BaseButton>
      </div>
    </div>
    <div>
      <BaseCard>
        <template #header>
          <div class="flex flex-row place-items-center font-sans">
            <img :src="currentUser?.photoURL || '/img/user.svg'" class="h-28 rounded-full border-primary border-2"/>
            <div class="flex flex-col ml-6">
              <h1 class="text-3xl font-bold font-sans ">
                {{getFullName}}
              </h1>
              <p class="text-sm font-sans ">
                {{getEmail}}
              </p>
            </div>
          </div>
        </template>
        <template #default>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <BaseInput :model-value="displayName" :placeholder="getFullName"></BaseInput>
            <BaseButton theme='error' @click="showPasswordModal = true">
              Change password
              <template #icon>
                <KeyIcon class="h-5"></KeyIcon>
              </template>
            </BaseButton>
            <GenerelDropDown :input-map="validLangs" :initial-value="validLangs.get(store.locale) ?? fallbackLang" @value-clicked:chosen-value="setSelectedLanguage"></GenerelDropDown>
            <BaseButton @click="()=>{$router.push({name: 'store'})}">
              Buy Subscription
              <template #icon>
                <CreditCardIcon class="h-5"></CreditCardIcon>
              </template>
            </BaseButton>
          </div>
          <div class="flex mt-10 w-full place-content-end">
            <BaseButton theme='primary' @click="async ()=> {await saveLocalSettings()}">
              Save settings
              <template #icon>
                <SaveIcon class="h-5"></SaveIcon>
              </template>
            </BaseButton>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-row place-items-center">
            <div>Contact support:&nbsp;</div>
            <ClickableLink ><a :href="'mailto:' + supportEmail">{{ supportEmail }}</a></ClickableLink>
          </div>
        </template>
      </BaseCard>
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
import { KeyIcon, SaveIcon, LogoutIcon, CreditCardIcon } from '@heroicons/vue/outline';
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
      CreditCardIcon
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
      changeLanguage(newLanguage : string){
        if (this.store.locale == newLanguage) return;
        this.store.setLocale(newLanguage);
      },
      setSelectedLanguage(language: string){
        this.selectedLanguage = language;
      },
      async saveLocalSettings(): Promise<void> {
        this.changeLanguage(this.selectedLanguage);
        this.store.notifications.push(new Notification("Settings updated!"));
      },
      async logout(){
        await logOut();
        this.$router.push({name: "dashboard"});
      }
    },
    mounted() {
      if (this.initialized)
        this.setCurrentUser();
    }
  });
</script>