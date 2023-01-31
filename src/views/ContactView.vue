<template>
  <body class="contact">
    <LandingNavBar />
    <main>
        <h1>this is contact view</h1>
    </main>
    <LandingFooter class="contact-footer"/>
  </body>
</template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import LandingNavBar from '@/components/LandingNavBar.vue';
  import LandingFooter from '@/components/LandingFooter.vue';


    export default defineComponent({
      name: "ContactView",
      components: { LandingNavBar, LandingFooter}
    })

  </script>
  
  <style>
  *{
    margin:0;
    padding:0
  }

  .contact h1{
    font-size: 7rem;
    color:red
  }
  .contact-footer{
    position: absolute;
    bottom:0;
    width:100%
  }
  </style>