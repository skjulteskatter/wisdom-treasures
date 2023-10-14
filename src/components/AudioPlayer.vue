<template>
  <div class="h-full flex items-center justify-between">
      <vue-plyr ref="plyr">
        <audio controls crossorigin playsinline 
        :on-play="registerPlay"
        @play="store.currentAudioPlayingId = uniqueId; registerPlay()"
        >
          <source
              :src="audioUrl"
              type="audio/mp3"
          />
        </audio>
      </vue-plyr>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { AudioClip } from '@/classes/AudioClip';
import { history } from '@/services/localStorage';
import { useSessionStore } from '@/stores/session';

export default defineComponent({
    name: "audio-player",
    data() {
        return {
          uniqueId: crypto.randomUUID(),
          store: useSessionStore(),
        }
      },
    methods: {
        registerPlay(){
          console.log("Now playing");
          history.addOrReplace(this.audioClip.id, Date.now());
        }
    },
    props: {
        audioClip: {
            type: Object as PropType<AudioClip>,
            required: true
        },
      },
    computed: 
    {
      audioUrl(): string {
        return this.audioClip.audioFile;
      },
      storeCurrentAudioPlayingId() : string{
        return this.store.currentAudioPlayingId;
      }
    },
    watch:{
      storeCurrentAudioPlayingId(newId: string) {
        if (newId != this.uniqueId){
          console.log("Pausing");
          this.$refs.plyr.player.pause();
        }
      }
    }
});
</script>

<!--This Stryle block can not be scoped-->
<style> 
.plyr--full-ui input[type=range] {
  color: var(--wt-color-secondary);
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