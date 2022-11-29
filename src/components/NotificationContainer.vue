<template>
    <div class="min-w-[14rem] w-[calc((100vw-80rem)*0.5)] fixed right-0 flex flex-col pr-4">
        <div id="forSpacing" class="grow"/>
        <NotificationCard v-for="(notification) in notificationsOnDisplay" :key="notification.id" class="mr-auto mb-4 smoothOpen fadeOut" 
            v-on:close="closeNotification(notification.id)" :notification="notification"/>
    </div>
</template>

<script lang="ts">
import { useSessionStore } from '@/stores/session';
import { defineComponent } from 'vue';
import NotificationCard from './NotificationCard.vue';
import { Notification } from '@/classes/notification'

export default defineComponent({
    name: "NotificationContainer",
    components: {
        NotificationCard,
    },
    data() {
       return {
         store: useSessionStore(),
         notificationsOnDisplay: [] as Notification[],
       }
    },
    computed: {
        notifications(){
            return this.store.notifications.filter(x => x.onDisplay) as Notification[];
        }
    },
    watch:{
        notifications(value : Notification[]){
            this.notificationsOnDisplay = value;
            setTimeout(() => {
                this.garbageCollect();
            }, 7000);
        }
    },
    mounted(){
        this.store.notifications.push(new Notification("This is a brand new notification!"));
    },
    methods: {
        closeNotification(id: string){
            console.log(id);
            for (let i = 0; i < this.store.notifications.length; i++) {
                if (this.store.notifications[i].id == id){
                    this.store.notifications[i].onDisplay = false;
                }
            }
            this.notificationsOnDisplay = this.notificationsOnDisplay.filter(x => x.id !== id);
            this.garbageCollect();
        },
        garbageCollect(){
            this.notificationsOnDisplay = this.notificationsOnDisplay.filter(x => x.onDisplay);
        }
    }
});
</script>

<style scoped>

.smoothOpen{
    animation: smoothOpen 0.35s both linear, fadeOut 7s both linear;
}

@keyframes smoothOpen {
  0% {
    opacity: 0;
    max-height: 0;
    transform: translateX(-30%);
    margin-bottom: 0;
  }

  50% {
    opacity: 0;
    max-height: 6em;
    transform: translateX(-30%);
    margin-bottom: 1rem;
  }

  100% {
    opacity: 1;
    max-height: 6em;
    transform: translateX(0%);
    margin-bottom: 1rem;
  }
}

@keyframes fadeOut {

  95% {
    opacity: 1;
  }
  100% {
  opacity: 0;
  }
}

</style>