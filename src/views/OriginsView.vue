<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-4 sm:top-20 left-0 z-40 w-full h-0">
        <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50"/>
        <ScrollToTopButton class="fixed top-0 h-max"/>
        <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50"/>
    </div>
    <div class="w-full bg-primary sm:bg-transparent shadow-md sm:shadow-none flex flex-col">
      <div class="w-full flex items-center mt-4 sm:my-4">
        <BackButton />
        <h1 class="absolute left-0 right-0 text-center text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">Origins</h1>
      </div>
      <BaseInput v-model="searchWord" style-type="search" size="lg" :placeholder="$t('themes.searchTheme')" @search-action="search($event)" :whiteText="true" class="my-4 px-5 sm:hidden"/>
      <BaseInput v-model="searchWord" style-type="search" size="lg" :placeholder="$t('themes.searchTheme')" @search-action="search($event)" class="hidden sm:block"/>
    </div>
    <div v-if="searchedWord" class=" ml-5 mt-4 sm:ml-0 text-[color:var(--wt-color-text-grey)] opacity-80">
        {{ $t('themes.showing') }} {{numberOfResults}} {{ $t('themes.resultsFor') }} "{{searchedWord}}"
    </div>
    <div id="wrapper" class="mt-10 flex pl-5 sm:pl-0 pt-5 sm:px-0" :class="{'pr-5' : searchedWord}">
      <div class="w-full">
        <div id="OriginCards" class="flex flex-wrap">
          <div v-for="(origin, index) in searchedOrigins" :key="origin.id" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0">
              <Origin :origin="origin"></Origin>
              <div :id="`${idLookUp.get(getFirstLetter(origin)) === index ? getFirstLetter(origin) : index.toString()}${idSalt}`"
                class="absolute -top-[4.5rem] thisIsJustForScrollingpurposes"
              />
          </div>
        </div>
      </div>
      <div id="alphabetslider" v-if="!searchedWord">
        <div class="w-10 flex flex-col sticky top-16 items-center font-bold opacity-30"
          @mousedown="mouseDownOverAlphabet = true"
          @mouseup="()=> {mouseDownOverAlphabet = false; mouseOverAlphabet = '';}" 
          @mouseleave="()=> {mouseDownOverAlphabet = false; mouseOverAlphabet = '';}">
          <div v-for="letter in alphabet" :key="letter" class="w-full flex justify-center cursor-pointer select-none" 
            @mouseover="mouseOverAlphabet = letter">
            {{ letter }}
          </div>
        </div>
      </div>
    </div>
  </main> 
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { useSessionStore } from '@/stores/session';
import BaseInput from '@/components/BaseInput.vue';
import type Fuse from 'fuse.js';
import BackButton from '@/components/BackButton.vue';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';
import type { Origin as OriginDto } from '@/classes/Origin';
import Origin from '@/components/Origin.vue';
import { log } from '@/services/env';

  export default defineComponent({
    name: "ThemesView",
    data() {
      return {
        store: useSessionStore(),

        mouseDownOverAlphabet: false as boolean,
        mouseOverAlphabet: "" as string,
        idLookUp: new Map as Map<string, number>,
        idSalt: "2e293801-ff46-4563-b380-3f4af1d08ef2" as string,
        scrollLock: false as boolean,

        searchWord: "" as string,
        searchedWord : "" as string,
      }
    },
    components: {
      BaseInput,
      BackButton,
      ScrollToTopButton,
      Origin
    },
    computed: {
      origins(): OriginDto[]{

        let sources : OriginDto[] = Array.from(this.store.origins.values());
        sources.sort((a: OriginDto,b : OriginDto) => this.getFirstLetter(a).localeCompare(this.getFirstLetter(b), "no"));

        //If the publications refs is not indexed
        if (this.idLookUp.size <= 0){
          for (let i = 0; i < sources.length; i++) {
            const pub = sources[i];
            if (this.idLookUp.get(this.getFirstLetter(pub)) === undefined) 
              this.idLookUp.set(this.getFirstLetter(pub), i)
          }
        }
        return sources;
      },
      fuseSources() : Fuse<OriginDto> | undefined{
            return this.store.fuseOrigins;
        },
      searchedOrigins() : OriginDto[]{
        let sources = [] as OriginDto[];
        if (this.fuseSources == undefined || this.searchedWord.length <= 0){
          sources = this.origins;
        } else {
          const result = this.fuseSources?.search(this.searchedWord);
          sources = result.map(x => x.item).sort((a: OriginDto,b : OriginDto) => this.getFirstLetter(a).localeCompare(this.getFirstLetter(b), "no"));
        }
        
        return sources;
      },
      mouseDownAndOverAlphabetEvent() : string {
        if (this.mouseDownOverAlphabet == false || this.mouseOverAlphabet == "" ) return "";
        this.scrollToLetter(this.mouseOverAlphabet);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.mouseOverAlphabet = "";
        return this.mouseOverAlphabet + this.mouseDownOverAlphabet ? "1" : "0";
      },
      numberOfResults() : number {
        return this.searchedOrigins.length;
      },
      alphabet(): string[] {
        const alphabet: string[] = [];
        for (const origin of this.searchedOrigins) {
          const firstLetter = this.getFirstLetter(origin);
          if (alphabet.includes(firstLetter)) continue;
          alphabet.push(this.getFirstLetter(origin));
        }
        return alphabet.sort((a,b) => a.localeCompare(b, "no"));
      }
    },
    watch: {
      // Kepp watcher just to have a refrence point
      mouseDownAndOverAlphabetEvent(){
      }
    },
    methods: {
      getFirstLetter(source: OriginDto) {
        return source.name.match(/[\p{Letter}\p{Mark}]/u)?.[0] ?? " ";
      },
      scrollToLetter(letter: string){
        //Scrollock and setTimout is a suboptimal soulution while we're waiting for scrollend callback
        if (this.scrollLock) return;
        this.scrollLock = true;
        setTimeout(() => {
          this.scrollLock = false;
        }, 200);
        try {
          let element = document.getElementById(letter + this.idSalt);
          if (element == null) return;
          element.scrollIntoView({behavior: "smooth"});
        } catch (e: any) {
          log && console.log("Couldn't find letter: " + letter + ". Warning: " + e);
        }
      },
      search(){
        this.searchedWord = this.searchWord;
      }
    }
  });
</script>@/classes/Origin