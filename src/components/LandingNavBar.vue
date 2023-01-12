<template>
    <div class="nav-bar">
        <p><strong>WT</strong></p>
        <div class="links">
            <a href="#">contact us</a>
            <a href="#">sign up</a>
        </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
      name: "LandingNavBar",
  });
  </script>

<style>
    .nav-bar{
        display: flex;
        justify-content: space-between;
        margin: 0 3em;
        padding: 0 1em 1em 1em;
        border-bottom: solid gray 1px
    }
    .links{
        display: flex
    }
    .nav-bar a{
        margin-left: 2em
    }
</style>