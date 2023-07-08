<template>
    <BaseModal :show="true" class="fixed w-full h-full left-0 top-0 z-40" @close="() => $emit('close')">
        <template #title> 
            <div class="flex">
                <div class="grow"></div>
                <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8 m-2 -mb-4" @click="() => $emit('close')">
					<XIcon class="h-8 opacity-50"/>
				</BaseButton>
            </div>
        </template>
            <div class="flex flex-col">
                <p>Old Password:</p>
                <BaseInput v-model="oldPassword" style-type="password" size="lg"/>
                <p>New Password:</p>
                <BaseInput v-model="firstPassword" style-type="password" size="lg"/>
                <p>Repeat Password:</p>
                <BaseInput v-model="secondPassword" style-type="password" size="lg"/>
                <BaseButton :theme="'error'" @click="async () => {await changePassword()}" class="mt-4"> 
                    Change password
                </BaseButton>
            </div>
    </BaseModal>
</template>

<script lang="ts">

import BaseModal from "../BaseModal.vue"
import BaseInput from "../BaseInput.vue"

import { defineComponent } from "vue";
import { XIcon } from "@heroicons/vue/solid";
import BaseButton from "../BaseButton.vue";
import { resetPassword } from "@/services/auth";
import { useSessionStore } from "@/stores/session";
import { Notification } from "@/classes/notification";

export default defineComponent({
    name: "change-password-modal",
    components: {
        BaseModal,
        BaseInput,
        XIcon,
        BaseButton,
    },
    data: () => ({
        searchWord: "" as string,
        firstPassword: "" as string,
        secondPassword: "" as string,
        oldPassword: "" as string,
        store: useSessionStore(),
    }),
    emits: ["close"],
    methods: {
        async changePassword(){
            if (this.firstPassword != this.secondPassword){
                this.store.notifications.push(new Notification("Passwords are not identical", "error", true));
                return;
            } 
            if (this.firstPassword.length < 1 || this.secondPassword.length < 1){
                this.store.notifications.push(new Notification("Password fields must be filled", "error", true));
                return;
            } 
            if (await resetPassword(this.oldPassword, this.firstPassword)) {
                this.store.notifications.push(new Notification("Password updated!", "default", true));
            } else {
                this.store.notifications.push(new Notification("Failed to update password", "error", true));
            }
            this.$emit('close');
        }
    }
});
</script>

<style>
</style>