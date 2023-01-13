<template>
    <div class="nav-bar">
        <p><strong>WT</strong></p>
        <div class="links">
            <router-link to="/contact">Contact</router-link>
            <router-link to="/contact">Sign up</router-link>
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
        align-items: center;
        margin: 0 3em;
        padding: 0 1em 1em 1em;
        border-bottom: solid gray 1px;
    }
    .links{
        display: flex
    }
    .nav-bar a{
        padding: 0.75em 2.5em;
        border-radius: 2em;
        font-weight: bold;
        transition: all 0.25s;
    }
    .nav-bar a:hover,
    .nav-bar a:active,
    .nav-bar a:focus{
        background-color: #ececec;
    }
</style>