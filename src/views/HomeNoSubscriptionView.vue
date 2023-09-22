<template>
  <main>
    <div>
      <img
        id="background-img"
        src="../../images/backgroundlogo.svg"
        class="hidden sm:block fixed -top-10 -right-44 2xl:-right-5 w-custom-45rem -z-20 transition-all duration-300 ease-in-out blur-sm"
      />
      <div
        class="flex py-10 bg-[color:var(--wt-c-white-soft)] sm:bg-transparent items-center shadow-md sm:shadow-none z-40 max-h-10 sm:h-auto w-full top-0 left-0 sm:static px-6 sm:px-0"
      >
        <h1
          class="text-base font-bold text-[color:var(--wt-color-text-grey)] opacity-80"
        >
          <span v-if="currentUser" class="sm:font-bold text-lg tracking-075">
            {{ $t("common.welcome") }},

            <span
              class="animated-gradient font-bold cursor-pointer"
              @click="$router.push({ name: 'profile' })"
            >
              {{ currentUser.displayName }}
            </span>
          </span>
          <span v-else class="sm:font-bold text-lg tracking-075">
            {{ $t("home.welcometo") }}
            <span class="animated-gradient font-bold"> WisdomTreasures </span>
          </span>
        </h1>
      </div>

      <div
        class="lg:flex items-center justify-center pt-10 md:pt-0"
        id="showcase"
      >
        <div class="md:w-1/2 mx-5 space-y-5 md:-translate-y-20 md:pb-40">
          <h1
            class="sm:text-3xl font-bold text-3xl sm:text-inherit tracking-wide"
          >
            {{ $t("nosub.title") }}
          </h1>
          <p>
            {{ $t("nosub.subtitle") }}
          </p>
          <BaseButton
            class="rounded-full"
            @click="$router.push({ name: 'store' })"
            theme="wisdomMannaBtn"
          >
            {{ $t("nosub.buy") }}
          </BaseButton>
        </div>

        <div class="h-screen md:w-1/2 px-5">
          <NoSubscriptionSlider class="h-2/3" />
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { getCurrentUserPromise } from "@/services/auth";
import type { User } from "@firebase/auth";
import type { Article, Publication } from "hiddentreasures-js";
import { defineComponent } from "vue";
import { useSessionStore } from "@/stores/session";
import { InlineNotification } from "@/classes/notification";
import router from "@/router";
import { mannaHistory, history } from "@/services/localStorage";
import BaseButton from "@/components/BaseButton.vue";
import NoSubscriptionSlider from "@/components/NoSubScriptionSlider.vue";

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      publications: [] as Publication[],
      currentUser: null as User | null,
      store: useSessionStore(),
      randomArticle: null as Article | null,
      wordOfTheDay: null as Article | null,
      showWordOfTheDay: false as boolean,
      randomArticleList: [] as Article[],
      shuffeledArticleKeys: [] as string[],
      loadingMoreArticles: false as boolean,
      dataFavorites: undefined as string[] | undefined,
      displayFavorites: false as boolean,
      displayWordOfTheDay: true as boolean,
      displayHistory: false as boolean,
    };
  },
  components: {
    BaseButton,
    NoSubscriptionSlider,
  },
  computed: {
    historyArticles(): Article[] {
      let historyArticlesIds: string[] = [];
      for (let [key, value] of history.getAll()) {
        historyArticlesIds.push(key);
      }
      for (let [key, value] of mannaHistory.getAll()) {
        historyArticlesIds.push(key);
      }
      return this.articles.filter((x) => historyArticlesIds.includes(x.id));
    },
    articles(): Article[] {
      const articles = Array.from(this.store.articles.values());
      return articles;
    },
    linkedArticle(): null | Article {
      if (this.homePath === this.currentPath) return null;
      const articleId = this.store.articleNumberLookup.get(
        this.currentPathNumber ?? -1
      );
      if (articleId === undefined) {
        this.articleNotFound(this.currentPathNumber ?? -1);
        return null;
      }

      const article = this.store.articles.get(articleId || "");
      if (article === undefined) {
        this.articleNotFound(this.currentPathNumber ?? -1);
        return null;
      }

      return article;
    },
    currentPath(): string {
      return !this.$route.path.endsWith("/")
        ? this.$route.path
        : this.$route.path.slice(0, this.$route.path.length - 1);
    },
    homePath(): string {
      let route =
        router.getRoutes().find((x) => x.name == "dashboard")?.path || "⛄";
      return !route.endsWith("/") ? route : route.slice(0, route.length - 1);
    },
    currentPathNumber(): number | null {
      let match = (this.currentPath.match(/[0-9]+$/) ?? [null])[0];
      if (match == null) return null;
      return parseInt(match);
    },
    sessionInitialized(): boolean {
      return this.store.sessionInitialized;
    },
    storeFavorites(): string[] {
      return this.store.favorites;
    },
    favorites(): string[] {
      return this.dataFavorites ?? this.storeFavorites;
    },
    favoriteArticles(): Article[] {
      const favoriteArticles = [];
      for (const favorite of this.favorites) {
        const article = this.store.articles.get(favorite);
        if (article === null || article === undefined) continue;
        favoriteArticles.push(article);
      }
      return favoriteArticles;
    },
  },
  watch: {
    sessionInitialized(initialized) {
      if (initialized) {
        this.checkArticleNumberPath();
        this.getAndSetWordOfTheDayArticle();
      }
    },
  },
  async mounted() {
    this.currentUser = (await getCurrentUserPromise()) as User;
    if (this.sessionInitialized) this.getAndSetWordOfTheDayArticle();

    for (const key of this.store.articles.keys()) {
      this.shuffeledArticleKeys.push(key);
    }

    Notification.requestPermission();
  },
  methods: {
    navigate(name: string, e?: Event) {
      if (name === "register") {
        //Just to mmake sure the login forms appears as 'register' and not as 'login'
        this.store.loginFormBridge = "register";
        name = "login";
      }
      router.push({ name: name });
    },
    articleNotFound(num: number): void {
      //Should probably navigate back 🤷‍♂️
      this.store.notifications.push(
        new InlineNotification(
          this.$t("home.couldNotFindArticleNumber") + num.toString(),
          "error"
        )
      );
      router.push({ name: "dashboard" });
    },
    checkArticleNumberPath() {
      if (this.homePath === this.currentPath) return;

      const articleId = this.store.articleNumberLookup.get(
        this.currentPathNumber || -1
      );
      if (articleId === undefined) {
        this.articleNotFound(this.currentPathNumber || NaN);
        return;
      }

      if (this.articles.some((x) => x.id == articleId)) return null;

      if (this.linkedArticle === null) this.articleNotFound(2);
    },
    getAndSetRandomArticle(): void {
      this.randomArticle =
        this.articles[Math.floor(Math.random() * this.articles.length)] || null;
      mannaHistory.addOrReplace(this.randomArticle.id);
      this.showWordOfTheDay = false;
    },
    getAndSetWordOfTheDayArticle(): void {
      let date: Date = new Date();
      let dateNumber: number =
        +`${date.getDay()}${date.getMonth()}${date.getFullYear()}999`;
      let randomNumber: number = this.mulberry32(dateNumber);
      let adjustedRandomNumber = Math.round(
        randomNumber * (this.articles.length - 1)
      );
      if (
        adjustedRandomNumber < 0 ||
        adjustedRandomNumber > this.articles.length - 1
      )
        adjustedRandomNumber = 0;
      this.wordOfTheDay = this.articles[adjustedRandomNumber] || null;
      this.showWordOfTheDay = true;
    },
    mulberry32(a: number): number {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    refreshDataFavorites() {
      this.dataFavorites = [...this.storeFavorites];
    },
    changeDisplayFavorites() {
      this.displayFavorites = true;
      this.displayWordOfTheDay = false;
      this.displayHistory = false;
    },
    changeDisplayHistory() {
      this.displayFavorites = false;
      this.displayWordOfTheDay = false;
      this.displayHistory = true;
    },
    changeDisplayWOTD() {
      this.displayFavorites = false;
      this.displayWordOfTheDay = true;
      this.displayHistory = false;
    },
  },
});
</script>
<style scoped>
.tracking-075 {
  letter-spacing: 0.075em;
}

.rounded-t-4xl {
  border-top-left-radius: 2.5rem;
  /* 40px */
  border-top-right-radius: 2.5rem;
  /* 40px */
}

.h-custom {
  height: max(28rem, 64vh);
}

.highlighted {
  font-size: 1.15rem;
  color: var(--wt-color-primary);
  opacity: 0.9;
  scale: 1.3;
}

@media (min-width: 640px) {
  .h-custom {
    height: auto;
  }

  .h-custom.fav-his {
    height: 18rem;
  }
}
</style>
