<template>
  <main>
    <h1 class="my-6 text-3xl font-bold">
      <span v-if="currentUser" class="font-bold gradient">
        Welcome, {{currentUser.displayName}}
      </span>
      <span v-else class="font-bold"> 
        Welcome to 
        <span class="animated-gradient font-bold">
          WisdomTreasures
        </span> 
      </span>
    </h1>
    <h2>Here's a big list</h2>
    <div v-for="(index) in Array<number>(50)" :key="index">
      <div>Hello! This is just some random content to try to fill up the page</div>
    </div>
  </main>
</template>

<script lang="ts">
import { getCurrentUserPromise } from '@/services/auth';
import { articleService, publicationService } from '@/services/publications';
import type { User } from '@firebase/auth';
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';

  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        publications : [] as Publication[],
        articles : [],
        currentUser : null as User | null,
      }
    },
    props: {
    },
    components: {
    },
    computed: {
    },
    async mounted() {

      this.currentUser = await getCurrentUserPromise() as User;

      if ("".toString() == "") return; //TODO remove this. This is just for testing and understanding the HT-JS package.

      this.publications = await publicationService.retrieve({
        parentIds: ["aa7d92e3-c92f-41f8-87a1-333375125a1c"], //Visdomsord
      });

      let firstPublication : Publication | undefined = this.publications.sort((a,b) => a.title.localeCompare(b.title)).at(0);

      console.log(firstPublication?.id);

      let articles : Article[] = (await articleService.retrieve({
            parentIds: [firstPublication?.id ?? ""],
            withContent: true,
      }))

      console.log(articles);
    },
  });
</script>