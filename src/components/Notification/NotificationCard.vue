<template>
    <div class="rounded-lg shadow-lg bg-white border-2"
        :class="[error ? 'border-[color:var(--wt-color-error)]' : 'border-primary']">
        <div class="p-2 text-center sm:text-left">
            <BaseButton theme="menuButton" size="small" class="w-6 self-center max-h-6 float-right z-10" @click="() => $emit('close')">
				<XIcon class="h-5" :class="[error ? 'error-color-filter' : 'opacity-50']"/>
			</BaseButton>
            {{notification.message}}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { XIcon } from '@heroicons/vue/outline';
import BaseButton from '../BaseButton.vue';
import { InlineNotification } from '@/classes/notification';

export default defineComponent({
    name: "NotificationCard",
    components: {
        XIcon,
        BaseButton,
    },
    emits: ["close"],
    props: {
        notification: {
            type: InlineNotification,
            required: true,
        },
    },
    computed: {
        error(){
            return this.notification.type == "error";
        }
    }
});
</script>