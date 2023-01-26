<template>
    <div class="nav-bar">
        <router-link to="/landing" class="WT-a">Wisdom Treasures</router-link>
        <div class="links">
            <router-link to="/contact">Contact</router-link>
            <router-link to="/login">Sign up</router-link>
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
        position: fixed;
        top: 0;
        z-index: 1;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1em 4em;
        background-color: rgba(255, 255, 255, 0.549);
        backdrop-filter: blur(10px);
    }
    .WT-a {
        font-family: 'EB Garamond', serif;
        font-size: 1.5rem
    }
    .links{
        display: flex
    }
    .links a{
        padding: 0.75em 3em;
        border-radius: 2em;
        font-weight: bold;
        transition: all 0.25s;
        color: #2B4453;
        border: 3px #2B4453 solid;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-left: 2em
    }
    .links a:hover,
    .links a:active,
    .links a:focus{
        background-color: #2B4453;
        color: white
    }
</style>