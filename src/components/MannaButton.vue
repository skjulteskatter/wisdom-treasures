<template>
  <main>
    <BaseButton class="z-50" @click="() => { buttonClick() }" theme="wisdomMannaBtn">
      <template #firstIcon>
        <SparklesIcon class="h-4 sm:text-inherit" />
      </template>
    </BaseButton>
    <WWCardModal :show="showMannaModal" @close="(e: Event | undefined) => { navigateBack(e); $emit('closeModal', e) }"
      :mannaArticleIdList="shuffeledMannaArticleIdList"
      :article="store.articles.get(shuffeledMannaArticleIdList[0])!" />
  </main>
</template>
    
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import WWCardModal from './WWCardModal.vue';
import { useSessionStore } from '@/stores/session';
import BaseButton from './BaseButton.vue';
import { history } from '@/services/localStorage';
import { SparklesIcon } from '@heroicons/vue/solid';

export default defineComponent({
  name: "MannaButton",
  data() {
    return {
      showMannaModal: false,
      store: useSessionStore(),
      shuffeledMannaArticleIdList: this.shuffle(this.mannaArticleIdList) as string[]
    }
  },
  props: {
    strechY: {
      type: Boolean,
      required: false
    },
    mannaArticleIdList: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
  },
  emits: ["closeModal"],
  components: {
    WWCardModal,
    BaseButton,
    SparklesIcon
  },
  computed: {
    currentPath() {
      return this.$route.path.endsWith("/") ? this.$route.path : this.$route.path + "/";
    },
  },
  async mounted() {
    this.checkRouteToModal();
  },
  watch: {
    $route() {
      this.checkRouteToModal()
    },
  },
  methods: {
    buttonClick(){
      this.$router.push({ path: `${this.currentPath}manna` });
      history.addOrReplace(this.shuffeledMannaArticleIdList[0], Date.now());
    },
    checkRouteToModal() {
      let manna = this.$route.params.mannaPath;
      if (manna != undefined && manna != null && manna != "") {
        this.showMannaModal = true;
      } else this.showMannaModal = false;
    },
    shuffle(array: string[]){
      return array.sort(() => Math.random() - 0.5); 
    },
    navigateBack(e?: Event) {

      if (e === undefined || e.defaultPrevented === true) return;

      if (this.$router.options.history.state.back == null) {
        this.$router.push({ name: "dashboard" });
      } else {
        this.$router.back();
      }
    },
    //Trims space without touching html tags
    smartTrim(s: string): string {
      return s.replace(/(\s*(?=<))|((?<=>)\s*)/g, "");
    }
  }
});
</script>