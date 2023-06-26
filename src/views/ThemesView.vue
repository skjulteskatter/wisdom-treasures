<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-20 left-0 z-40 w-full h-0">
        <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50"/>
        <ScrollToTopButton class="fixed top-0 h-max"/>
        <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50"/>
    </div>
    <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex flex-col">
      <div class="flex items-center mt-4 sm:my-6 justify-between">
        <BackButton/>
        <h1 class="text-base sm:text-xl self-center font-bold text-white sm:text-inherit tracking-wide">{{ $t('common.themes') }}</h1>
        <BackButton class="opacity-0"/>
      </div>
      <BaseInput v-model="searchWord" style-type="search" size="lg" :placeholder="$t('themes.searchTheme')" @search-action="search($event)" :white-text="true" class="my-4 px-5 sm:hidden"/>
      <BaseInput v-model="searchWord" style-type="search" size="lg" :placeholder="$t('themes.searchTheme')" @search-action="search($event)" class="hidden sm:block"/>
    </div>
    <div v-if="searchedWord" class="font-bold ml-5 mt-4 sm:ml-0 text-[color:var(--wt-color-text-grey)] opacity-80">
        {{ $t('themes.showing') }} {{numberOfResults}} {{ $t('themes.resultsFor') }} "{{searchedWord}}"
    </div>
    <div id="wrapper" class="flex pl-5 sm:pl-0 pt-5 sm:px-0" :class="{'pr-5' : searchedWord}">
      <div class="w-full">
        <div id="ThemeCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <div v-for="(publication, index) in searchedPublications" :key="publication.id" class="flex flex-col">
            <ThemeCard :publication="publication" class="grow" 
              :strech-y="true"/>
              <div :id="`${idLookUp.get(getFirstLetter(publication)) === index ? getFirstLetter(publication) : index.toString()}${idSalt}`"
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
import ThemeCard from '@/components/ThemeCard.vue';
import type { Publication } from 'hiddentreasures-js';
import BaseInput from '@/components/BaseInput.vue';
import type Fuse from 'fuse.js';
import BackButton from '@/components/BackButton.vue';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';

  export default defineComponent({
    name: "ThemesView",
    data() {
      return {
        store: useSessionStore(),

        mouseDownOverAlphabet: false as boolean,
        mouseOverAlphabet: "" as string,
        idLookUp: new Map as Map<string, number>,
        idSalt: "a709b27a-55a5-44b4-b34d-1ef114b56f73" as string,
        scrollLock: false as boolean,

        searchWord: "" as string,
        searchedWord : "" as string,
      }
    },
    components: {
      ThemeCard,
      BaseInput,
      BackButton,
      ScrollToTopButton
    },
    computed: {
      publications(): Publication[]{
        let pubs : Publication[] = Array.from(this.store.publications.values());
        pubs.sort((a: Publication,b : Publication) => this.getFirstLetter(a).localeCompare(this.getFirstLetter(b), "no"));

        //If the publications refs is not indexed
        if (this.idLookUp.size <= 0){
          for (let i = 0; i < pubs.length; i++) {
            const pub = pubs[i];
            if (this.idLookUp.get(this.getFirstLetter(pub)) === undefined) 
              this.idLookUp.set(this.getFirstLetter(pub), i)
          }
        }
        return pubs;
      },
      fusePublications() : Fuse<Publication> | undefined{
            return this.store.fusePublications;
        },
      searchedPublications() : Publication[]{
        let pubs = [] as Publication[];
        if (this.fusePublications == undefined || this.searchedWord.length <= 0){
          pubs = this.publications;
        } else {
          const result = this.fusePublications?.search(this.searchedWord);
          pubs = result.map(x => x.item).sort((a: Publication,b : Publication) => this.getFirstLetter(a).localeCompare(this.getFirstLetter(b), "no"));
        }
        
        return pubs;
      },
      mouseDownAndOverAlphabetEvent() : string {
        if (this.mouseDownOverAlphabet == false || this.mouseOverAlphabet == "" ) return "";
        this.scrollToLetter(this.mouseOverAlphabet);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.mouseOverAlphabet = "";
        return this.mouseOverAlphabet + this.mouseDownOverAlphabet ? "1" : "0";
      },
      numberOfResults() : number {
        return this.searchedPublications.length;
      },
      alphabet(): string[] {
        const alphabet: string[] = [];
        for (const publication of this.searchedPublications) {
          const firstLetter = this.getFirstLetter(publication);
          if (alphabet.includes(firstLetter)) continue;
          alphabet.push(this.getFirstLetter(publication));
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
      getFirstLetter(publication: Publication) {
        return publication.title.match(/[\p{Letter}\p{Mark}]/u)?.[0] ?? " ";
      },
      scrollToLetter(letter: string){
        //Scrolllock and setTimout is a suboptimal soulution while we're waiting for scrollend callback
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
          console.log("Couldn't find letter: " + letter + ". Warning: " + e);
        }
      },
      search(event: Event){
        this.searchedWord = this.searchWord;
      }
    }
  });
</script>