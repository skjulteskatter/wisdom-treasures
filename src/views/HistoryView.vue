<template>
  <main>
    <div id="scrollToTopButtonDiv" class="flex fixed top-4 sm:top-20 left-0 z-40 w-full h-0">
      <div id="spacerDiv1" class="grow pointer-events-none h-0 -z-50" />
      <ScrollToTopButton class="fixed top-0 h-max" />
      <div id="spacerDiv2" class="grow pointer-events-none h-0 -z-50" />
    </div>
    <div>
      <div class="bg-primary sm:bg-transparent shadow-md sm:shadow-none flex items-center py-4">
        <BackButton />
        <h1 class="absolute left-0 right-0 text-center text-base sm:text-xl font-bold text-white sm:text-inherit tracking-wide">
          {{ $t('common.history')}}
        </h1>
      </div>
      <div class="flex mx-5 sm:mx-0 mt-5 sm:mt-0">
        <div class="grow" />
        <div class="flex flex-col min-w-50">
          <ToggleSlideButton :label="$t('history.onlyManna')" v-model="showOnlyMannaHistory" />
          <div v-for="(value, key) in periods" :key="key + showOnlyMannaHistory.toString()">

            <div id="wrapperDiv" class="mt-5" :class="{ 'hidden': loadPeriodName[key] !== true }">
              <div class="text-base font-bold opacity-80 flex cursor-pointer whitespace-nowrap w-min"
                @click="addOrRemoveHiddenPeriod(key.toString())">
                {{ key }}
                <ChevronUpIcon class="h-5 self-center ml-2"
                  :class="{ 'rotate-180': hiddenPeridos.includes(key.toString()) }" />
              </div>
              <div class="border-l-2 pl-4 ml-2 my-6 border-[color:var(--wt-color-secondary-light)]"
                :class="{ 'hidden': hiddenPeridos.includes(key.toString()) }">
                <div class="" v-for="article in getArticlesFromDays(value, key.toString())"
                  :key="article.id + showOnlyMannaHistory.toString()">
                  <WWCard :article="article" class="my-2 sm:max-w-lg">
                    <template #footer>
                      <div class="flex">
                        <div class="self-center mr-2">
                          <ClockIcon class="h-5 opacity-40" />
                        </div>
                        <div class="self-center opacity-50 text-xs">{{ getStringFromDate(historyIds.find(x => x.id ==
                          article.id)?.lastViewed ?? new Date) }}</div>
                        <div class="justify-end">
                        </div>
                      </div>
                    </template>
                  </WWCard>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grow" />
      </div>
    </div>
    <div class="grow flex flex-col" :class="{ 'hidden': !historyIsEmpty }">
      <div class="grow" />
      <QuestionMarkCircleIcon class="w-20 grayscale opacity-80 place-self-center" />
      <div class="place-self-center">{{ $t('history.noWW') }}</div>
      <div class="grow" />
    </div>
  </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import BackButton from '@/components/BackButton.vue';
import { useSessionStore } from '@/stores/session';
import WWCard from '@/components/WWCard.vue';
import { mannaHistory, history } from '@/services/localStorage';
import type { Article } from 'hiddentreasures-js';
import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/vue/outline';
import ToggleSlideButton from '@/components/ToggleSlideButton.vue';
import { ChevronUpIcon } from '@heroicons/vue/outline';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';

export default defineComponent({
  name: "HistoryView",
  data() {
    return {
      store: useSessionStore(),
      showOnlyMannaHistory: true,
      periods: {
        "Today": [-1, 1],
        "This Week": [1, 7],
        "This Month": [7, 30],
        "This Year": [30, 365],
        "Earlier": [365, 1000],
      } as { [key: string]: [number, number] },
      historyIds: [] as { id: string, lastViewed: Date, manna: boolean }[],
      loadPeriodName: {} as { [key: string]: boolean },
      displayedPeriodKeys: [] as string[],
      historyArticles: [] as Article[],
      mannaHistoryArticles: [] as Article[],
      hiddenPeridos: [] as string[],
      
    }
  },
  components: {
    BackButton,
    WWCard,
    ClockIcon,
    QuestionMarkCircleIcon,
    ToggleSlideButton,
    ChevronUpIcon,
    ScrollToTopButton
  },
  computed: {
    historyIsEmpty() {
      for (let _ in this.loadPeriodName) { return false } return true;
    },
    articles(): Article[] {
      return Array.from(this.store.articles.values());
    },
    translatedThisWeek() {
      return this.$t('common.thisWeek');
    },
    translatedThisMonth() {
      return this.$t('common.thisMonth');
    },
    translatedThisYear() {
      return this.$t('common.thisYear');
    },
    translatedEarlier() {
      return this.$t('common.earlier');
    },
  },
  mounted() {
    this.setHistoryIds();
  },
  methods: {
    addOrRemoveHiddenPeriod(key: string) {
      if (this.hiddenPeridos.includes(key)) {
        this.hiddenPeridos = this.hiddenPeridos.filter(x => x != key);
      } else {
        this.hiddenPeridos.push(key);
      }
    },
    getArticlesFromDays(days: [number, number], key: string): Article[] {
      let IDs: string[] = this.historyIds.filter(x => {

        if (this.showOnlyMannaHistory && !x.manna) {
          return false;
        }

        //Create date without hours, minutes...
        let y = new Date(x.lastViewed.getTime());
        y.setHours(0, 0, 0, 0);

        //Create date without hours, minutes...
        let dateNow = new Date();
        dateNow.setHours(0, 0, 0, 0);

        return y.getTime() <= (dateNow.getTime() - (days[0] * 24 * 60 * 60 * 1000)) && y.getTime() > (dateNow.getTime() - (days[1] * 24 * 60 * 60 * 1000))
      }).map(x => x.id);

      let articles = this.articles.filter(x => IDs.includes(x.id)).sort((a, b) => {
        if ((this.historyIds.find(x => x.id == a.id)?.lastViewed ?? new Date()) < (this.historyIds.find(x => x.id == b.id)?.lastViewed ?? new Date())) return 1;
        return -1;
      });

      this.loadPeriodName[key] = articles.length > 0;

      return articles;
    },
    setHistoryIds() {
      for (let [key, value] of history.getAll()) {
        this.historyIds.push({ id: key, lastViewed: new Date(+(value ?? Date.now())), manna: false });
      }
      for (let [key, value] of mannaHistory.getAll()) {
        this.historyIds.push({ id: key, lastViewed: new Date(+(value ?? Date.now())), manna: true });
      }
    },
    getStringFromDate(date: Date): string {
      let days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      let timeDiff = Date.now() - date.getTime();

      if (timeDiff < 60 * 1000) {
        return this.$t('common.justNow');
      } else if (timeDiff < 60 * 60 * 1000) {
        return `${(timeDiff / 1000 / 60).toFixed()} {this.$t('common.minutesAgo')}`;
      } else if (timeDiff < 24 * 60 * 60 * 1000) {
        return `${(timeDiff / 1000 / 60 / 60).toFixed()} this.$t('common.hoursAgo')`;
      } else if (Date.now() - date.getTime() < 24 * 6) {
        return days[date.getDay()];
      } else
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
  }
});
</script>
<style>
.min-w-50{
  min-width: 50%
}
</style>