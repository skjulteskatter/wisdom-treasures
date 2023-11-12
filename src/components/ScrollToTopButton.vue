<template>
    <BaseButton @click="scrollToTop" theme="threeDBtn" class="opacity-0 shadow-xl" :class="[{'buttonAppear': showButton === true, 'buttonDisAppear' : showButton === false, 'hidden' : initialOff}]">
        {{ $t('back-to-the-top-button-text') }}
    </BaseButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from './BaseButton.vue';

export default defineComponent({
    name: "scroll-to-top-button",
    components: {
        BaseButton,
    },
    methods: {
        scrollToTop(){
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        async onScroll(){
            if (window.pageYOffset > window.innerHeight){
                this.initialOff= false;
                this.showButton = true;
            } else {
                this.showButton = false;
            }
        },
    },
    data() {
      return {
        showButton: false, 
        initialOff: true,
      }
    },
    mounted(){
        window.addEventListener('scroll', this.onScroll);
    }
});
</script>

<style scoped>
.buttonAppear{
    animation: smoothArrowAppear 0.2s both linear;
}

@keyframes smoothArrowAppear {
  0% {
    opacity: 0;
    transform: translateY(-50%);
  }

  100% {
    opacity: 1;
    transform: translateY(0%);
  }
}

.buttonDisAppear{
    animation: smoothArrowDisAppear 0.2s both linear;
}

@keyframes smoothArrowDisAppear {
  0% {
    opacity: 1;
    transform: translateY(0%);
  }

  100% {
    opacity: 0;
    transform: translateY(-50%);
  }
}
</style>