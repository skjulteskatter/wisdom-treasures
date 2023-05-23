<template>
    <main>
      <BaseCard :loading="loading">
        <template #footer>
            <div class="w-full flex">
                <div class="grow self-center text-xs text-[color:var(--wt-color-text-grey)]" v-html="mannaCopyRightHTML"/> 
                <div class="self-center">
                    <PopUpMessage class="z-10" :open="openCopyToClipBoardPopUpSemaphore > 0" :text="'Copied to clipboard!'"></PopUpMessage>
                    <BaseButton theme="menuButton" size="small" class="w-8 self-center max-h-8 mx-2" @click="() => {copyToClipBoard()}">
                        <ClipboardCopyIcon class="h-8 opacity-50 pop" :key="copyToClipBoardKey"/>
                    </BaseButton>
                </div>
            </div>
        </template>
        <template #default>  
          <div class="flex">
            <div id="spacerdiv1" class="flex grow"/>
            <div class="flex max-w-2xl flex-col font-serif">
                <div class="flex self-center">
                  <p class="self-center font-bold text-xl mt-3">{{ manna.reference }}</p>
                </div>
                <div class="grow m-5">{{ mannaContent }} </div>
            </div>
            <div id="spacerdiv2" class="flex grow"/>
          </div>
        </template>
    </BaseCard>
    </main>
  </template>
    
  <script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { useSessionStore } from '@/stores/session';
  import { uuid } from 'vue-uuid';
  import PopUpMessage from './PopUpMessage.vue';
  import BaseButton from './BaseButton.vue';
  import { ClipboardCopyIcon } from '@heroicons/vue/outline';
  import type { Manna } from '@/classes/manna';
  import { getCopyRightWithShortLinkHTML, getContent } from '@/services/mannaService'

    export default defineComponent({
      name: "WWShowCard",
      data() {
        return {
          store: useSessionStore(),
          copyToClipBoardKey: uuid.v4() as string,
          openCopyToClipBoardPopUpSemaphore: 0 as number,
        }
      },
      props: {
        manna: {
            type: Object as PropType<Manna>,
            required: true
        },
        strechY: {
            type: Boolean,
            required: false
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        },
      },
      components: {
        BaseCard,
        PopUpMessage,
        BaseButton,
        ClipboardCopyIcon,
      },
      computed: {
        currentPath(){
          return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
        },
        mannaContent() : string {
          let content = getContent(this.manna);
          let lefties : number = content.match(/«/g)?.length ?? 0;
          let righties : number = content.match(/»/g)?.length ?? 0;

          if (content.endsWith("»") && righties == lefties + 1)
            content = "«" + content;
          else if (righties + 1 == lefties)
            content = content + "»";

          return content.replace("«", "“").replace("»","”");
        },
        mannaCopyRightHTML() : string {
          return getCopyRightWithShortLinkHTML(this.manna);
        }
      },
      methods: {
        copyToClipBoard() {
            this.copyToClipBoardKey = uuid.v4();
            if (!this.mannaContent) return;
            navigator.clipboard.writeText(this.mannaContent);

            this.openCopyToClipBoardPopUpSemaphore++;
            setTimeout(() => {
                this.openCopyToClipBoardPopUpSemaphore--;
            }, 2000);
        },
      },
    });
  </script>