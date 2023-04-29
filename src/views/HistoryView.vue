<template>
  <main>
    <div>
      <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center">
          <BackButton/>
          <h1 class="my-6 text-2xl sm:text-3xl font-bold text-white sm:text-inherit tracking-wide">History</h1>
      </div>
      <div class="flex mx-5 sm:mx-0 mt-5 sm:mt-0">
        <div class="grow"/>
        <div class="flex flex-col">
          <div v-for="(value, key) in periods" :key="key">
            <div id="wrapperDiv" :class="{'hidden' : loadPeriodName[key] !== true}">
              <div class="text-xl sm:text-2xl font-bold opacity-80">{{key}}</div>
              <div class="border-l-2 pl-4 ml-2 my-6 border-[#BB9758]/50">
                <div class="" v-for="article in getArticlesFromDays(value, key.toString())" :key="article.id">
                  <WWCard :article="article" class="my-2 sm:max-w-lg">
                    <template #footer>
                      <div class="flex">
                        <div class="self-center mr-2">
                          <ClockIcon class="h-6 opacity-40"/>
                        </div>
                        <div class="self-center opacity-50">{{getStringFromDate(historyIds.find(x => x.id == article.id)?.lastViewed ?? new Date)}}</div>
                      </div>
                    </template>
                  </WWCard>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grow"/>
      </div>
    </div>
    <div class="grow flex flex-col" :class="{'hidden' : !historyIsEmpty}">
      <div class="grow"/>
      <QuestionMarkCircleIcon class="w-20 grayscale opacity-80 place-self-center"/>
      <div class="place-self-center">Looks like you haven't clicked on any wisdomwords yet...</div>
      <div class="grow"/>
    </div>
    </main>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import BackButton from '@/components/BackButton.vue';
  import { useSessionStore } from '@/stores/session';
  import WWCard from '@/components/WWCard.vue';
  import { history } from '@/services/localStorage';
  import type { Article } from 'hiddentreasures-js';
  import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/vue/outline';
  
    export default defineComponent({
      name: "SearchView",
      data() {
          return {
              store: useSessionStore(),
              periods: {
                "Today": [-1,1],
                "This Week": [1,7],
                "This Month": [7,30],
                "This Year": [30,365],
                "Earlier": [365,1000],
              } as {[key:string]: [number, number]},
              historyIds: [] as {id: string, lastViewed: Date}[],
              loadPeriodName : {} as {[key:string]:boolean},
          }
      },
      components: {
          BackButton,
          WWCard,
          ClockIcon,
          QuestionMarkCircleIcon
      },
      computed: {
        historyIsEmpty() {
          for (let _ in this.loadPeriodName) {return false} return true;
        },
        articles(): Article[]{
          return Array.from(this.store.articles.values());
        }
      },
      mounted() {
        this.setHistoryIds();
      },
      methods: {
        getArticlesFromDays(days: [number, number], key:string) : Article[]{
          let IDs : string[] = this.historyIds.filter(x => {

              //Create date without hours, minutes...
              let y = new Date(x.lastViewed.getTime());
              y.setHours(0,0,0,0);

              //Create date without hours, minutes...
              let dateNow = new Date();
              dateNow.setHours(0,0,0,0);

              return y.getTime() <= (dateNow.getTime() - (days[0] * 24 * 60 * 60 * 1000)) && y.getTime() > (dateNow.getTime() - (days[1] * 24 * 60 * 60 * 1000))
            }).map(x => x.id);

            let articles = this.articles.filter(x => IDs.includes(x.id)).sort((a,b) => {
              if ((this.historyIds.find(x => x.id == a.id)?.lastViewed ?? new Date()) < (this.historyIds.find(x => x.id == b.id)?.lastViewed ?? new Date())) return 1;
              return -1;
            });

            if (articles.length > 0) {
              this.loadPeriodName[key] = true;
            }

            return articles;
        },
        setHistoryIds(){
          for (let [key, value] of history.getAll())
          {
            this.historyIds.push({id: key, lastViewed: new Date(+(value ?? Date.now()))});
          }
        },
        getStringFromDate(date: Date): string {
          let days : string[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

          let timeDiff = Date.now() - date.getTime();

          if (timeDiff < 60 * 1000){
            return "Just now";
          } else if (timeDiff < 60 * 60 * 1000){
            return `${(timeDiff/1000/60).toFixed()} minutes ago`;
          } else if (timeDiff < 24 * 60 * 60 * 1000){
            return `${(timeDiff/1000/60/60).toFixed()} hours ago`;
          } else if (Date.now() - date.getTime() < 24 * 6){
            return days[date.getDay()];
          } else 
          return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
        }
      }
    });
  </script>