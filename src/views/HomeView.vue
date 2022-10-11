<template>
  <main>
    <h1>Hello, and welcome to the home view</h1>
  </main>
</template>

<script lang="ts">
import { publicationService } from '@/services/publications';
import { defineComponent } from 'vue';

  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        publications : [],
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
      //console.log(await publicationService.list());
      await publicationService.retrieve({
        parentIds: ["aa7d92e3-c92f-41f8-87a1-333375125a1c"],
      }).then(r => {
        console.log(r);
      });
    },
    methods: {
    },
  });
</script>