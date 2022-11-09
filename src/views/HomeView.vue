<template>
  <main>
    <h1>Hello, and welcome to the home view</h1>
    <br/>
    <h1>Here's a big list</h1>
    <br/>
    <p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p><p>Yo!</p>
  </main>
</template>

<script lang="ts">
import { articleService, publicationService } from '@/services/publications';
import type { Article, Publication } from 'hiddentreasures-js';
import { defineComponent } from 'vue';

  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        publications : [] as Publication[],
        articles : [],
      }
    },
    props: {
    },
    components: {
    },
    computed: {
    },
    async mounted() {
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
    methods: {
    },
  });
</script>