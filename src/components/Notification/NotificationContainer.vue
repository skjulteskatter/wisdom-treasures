<template>
    <div class="pb-16 sm:pb-0 min-w-[14rem] sm:w-[calc((100vw-80rem)*0.5)] w-full fixed right-0 flex flex-col pl-4 sm:pl-0 pr-4 pointer-events-none z-50">
        <div id="forSpacing" class="grow"/>
        <NotificationCard v-for="(notification) in notificationsOnDisplay" :key="notification.id" class="sm:mr-auto mb-4 smoothOpen fadeOut pointer-events-auto" 
            v-on:close="closeNotification(notification.id)" :notification="notification"/>
    </div>
</template>

<script lang="ts">
import { useSessionStore } from '@/stores/session';
import { defineComponent } from 'vue';
import NotificationCard from './NotificationCard.vue';
import type { InlineNotification } from '@/classes/notification'

export default defineComponent({
    name: "NotificationContainer",
    components: {
        NotificationCard,
    },
    data() {
       return {
         store: useSessionStore(),
         notificationsOnDisplay: [] as InlineNotification[],
       }
    },
    computed: {
        notifications(){
            return this.store.notifications.filter(x => x.onDisplay) as InlineNotification[];
        }
    },
    watch:{
        notifications(value : InlineNotification[]){
            this.notificationsOnDisplay = value;
            setTimeout(() => {
                this.garbageCollect();
            }, 7000);
        }
    },
    methods: {
        closeNotification(id: string){
            const index = this.store.notifications.findIndex(x => x.id == id);
            this.store.notifications[index].onDisplay = false;
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