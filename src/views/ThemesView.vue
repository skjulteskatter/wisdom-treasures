<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      Themes
    </h1>
    <div id="wrapper" class="flex">
      <div>
        <div id="WWCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <div v-for="(publication, index) in publications" :key="index" class="flex flex-col">
            <ThemeCard :publication="publication" class="grow" 
              :strech-y="true"/>
              <div :id="`${idLookUp.get(getFirstLetter(publication)) === index ? getFirstLetter(publication) : index.toString()}${idSalt}`"
                class="absolute -top-[4.5rem] thisIsJustForScrollingpurposes"
              />
          </div>
        </div>
      </div>
      <div id="alphabetslider">
        <div class="w-10 flex flex-col sticky top-16 items-center font-bold"
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

  export default defineComponent({
    name: "ThemesView",
    data() {
      return {
        store: useSessionStore(),
        dataFavorites : undefined as string[] | undefined,
        alphabet: [] as string[],
        mouseDownOverAlphabet: false as boolean,
        mouseOverAlphabet: "" as string,
        idLookUp: new Map as Map<string, number>,
        idSalt: "a709b27a-55a5-44b4-b34d-1ef114b56f73" as string,
        scrollLock: false as boolean,
      }
    },
    components: {
      ThemeCard
    },
    computed: {
      publications() : Publication[] {
        let pubs : Publication[] = Array.from(this.store.publications.values());
        pubs.sort((a: Publication,b : Publication) => this.getFirstLetter(a).localeCompare(this.getFirstLetter(b)));
        this.sortAlphabet();

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
      mouseDownAndOverAlphabetEvent() : string {
        if (this.mouseDownOverAlphabet == false || this.mouseOverAlphabet == "" ) return "";
        this.scrollToLetter(this.mouseOverAlphabet);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.mouseOverAlphabet = "";
        return this.mouseOverAlphabet + this.mouseDownOverAlphabet ? "1" : "0";
      },
    },
    watch: {
      // Kepp watcher just to have a refrence point
      mouseDownAndOverAlphabetEvent(){
      }
    },
    methods: {
      getFirstLetter(publication: Publication) {
        const letter : string = publication.title.match(/[\p{Letter}\p{Mark}]/u)?.[0] ?? " ";
        if (!this.alphabet.includes(letter)) this.alphabet.push(letter);
        return letter;
      },
      sortAlphabet(){
        this.alphabet.sort();
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
      }  
    }
  });
</script>