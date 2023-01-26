<template>
    <div class="nav-bar">
        <router-link to="/landing" class="WT-a">Wisdom Treasures</router-link>
        <div class="links">
            <router-link to="/contact" class="contact-a">Contact</router-link>
            <router-link to="/login" class="login-a">Sign up</router-link>
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
        text-align: center;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 3px;
    }
    .links .contact-a{
        border: none
    }
    .contact-a:hover,
    .contact-a:active,
    .contact-a:focus{
        border-bottom:3px #2B4453 solid
    }
    .links .login-a{
        margin-left: 1.5em;
        border: 3px #2B4453 solid;
    }
    .login-a:hover,
    .login-a:active,
    .login-a:focus{
        background-color: #2B4453;
        color: white
    }
</style>