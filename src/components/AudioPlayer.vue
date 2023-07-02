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

export default defineComponent({
    name: "audio-player",
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
  color: var(--wt-color-secondary);
}
.plyr__progress__buffer{
  background-color:var(--wt-color-secondary);
}

.plyr__control--overlaid {
  background: rgba(var(--wt-color-secondary), .8);
}

.plyr__control.plyr__tab-focus {
  box-shadow: 0 0 0 5px rgba(var(--wt-color-secondary), .5);
}

.plyr__menu__container .plyr__control[role=menuitemradio][aria-checked=true]::before {
  background: var(--wt-color-secondary);
}

.plyr__controls__item[data-plyr=play]{
  height: 3rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
  display:flex;
  justify-content: center;
  align-items:center;

  background:#ba9b6787;
}
.plyr__controls__item[data-plyr=play] svg{
  color:var(--wt-color-secondary);
}
.plyr__controls__item[data-plyr=play] svg:hover{
  color:white
}

.plyr__control[data-plyr=mute]{
  border-radius: 50%
}

.plyr--audio .plyr__control.plyr__tab-focus,
.plyr--audio .plyr__control:hover,
.plyr--audio .plyr__control[aria-expanded=true] {
  background: #ba9b67dd;
}

/* Hide to  */
.plyr__menu{
    display: none;
    width: 0%;
    height: 0%;
}

</style>