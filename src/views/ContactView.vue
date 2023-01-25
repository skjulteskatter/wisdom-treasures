<template>
    <LandingNavBar />
    <main>
        <h1>this is contact view</h1>
    </main>
    <FooterComponent />
</template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import LandingNavBar from '@/components/LandingNavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';


    export default defineComponent({
      name: "ContactView",
      components: { LandingNavBar, FooterComponent}
    })

  </script>
  
  <style>
  </style>