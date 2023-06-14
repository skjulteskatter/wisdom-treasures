<template>
  <div class="h-full flex items-center justify-between">
      <vue-plyr>
        <audio controls crossorigin playsinline>
          <source
              src="../assets/example.mp3"
              type="audio/mp3"
          />
        </audio>
      </vue-plyr>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import BaseCard from './BaseCard.vue';

export default defineComponent({
    name: "audio-player",
    components: {
        BaseCard
    },
    methods: {
        navigateBack(){
            if (router.options.history.state.back == null){
                router.push({name: "dashboard"});
            } else {
                router.back();
            }
        }
    }
});
</script>

<style>
.plyr--full-ui input[type=range] {
  color: var(--wt-color-primary);
}

.plyr__control--overlaid {
  background: rgba(var(--wt-color-primary), .8);
}

.plyr--video .plyr__control.plyr__tab-focus,
.plyr--video .plyr__control:hover,
.plyr--video .plyr__control[aria-expanded=true] {
  background: var(--wt-color-primary);
}

.plyr__control.plyr__tab-focus {
  box-shadow: 0 0 0 5px rgba(var(--wt-color-primary), .5);
}

.plyr__menu__container .plyr__control[role=menuitemradio][aria-checked=true]::before {
  background: var(--wt-color-primary);
}

.plyr--audio .plyr__control.plyr__tab-focus,
.plyr--audio .plyr__control:hover,
.plyr--audio .plyr__control[aria-expanded=true] {
  background: var(--wt-color-primary);
}

/* Hide to  */
.plyr__menu{
    display: none;
    width: 0%;
    height: 0%;

}

</style>