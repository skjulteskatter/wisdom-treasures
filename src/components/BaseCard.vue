<template>
    
    <div class="rounded-lg shadow-md flex flex-col" :class="[glass ? 'glass bg-white/50' : 'bg-white/80']">
        <Loader :loading="loading" class="glassDropDown absolute z-50 overflow-hidden rounded-lg"></Loader>
        <div class=" " :class="forBaseModal === true ? 'p-0' : 'px-4 py-3 font-serif text-2xl border-b border-black/10'" v-if="$slots.header">
            <slot name="header" />
        </div>
        <div class="p-4" :class="[WWCard ? 'flex-grow' : '']" v-if="$slots.default">
            <slot name="default" />
        </div>
        <div class="px-4 py-3 border-t border-black/10" v-if="!hideFooter && $slots.footer">
            <slot name="footer" />
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Loader from './Loader.vue';

export default defineComponent({
    name: "BaseCard",
    components: {
        Loader
    },
    props: {
        glass: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        forBaseModal: {
            type: Boolean,
            default: false,
        },
        WWCard: {
            type: Boolean,
            default: false,
        },
        hideFooter:{
            type: Boolean,
            default: false
        }
    }
});
</script>

<style scoped>
.glassDropDown {
	background: (255, 255, 255, 0.1);
	backdrop-filter: blur(3px);
	-webkit-backdrop-filter: blur(3px);
}
.glassDropDown > div {
	background: rgba(255, 255, 255, 0.5);
}

</style>