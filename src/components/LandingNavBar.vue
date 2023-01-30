<template>
    <header>
        <router-link to="/landing" class="logo">Wisdom Treasures</router-link>
        <button class="mobile-nav-toggle" 
                aria-controls="primary-nav" @click="isActive = !isActive">
            <span class="sr-only">Menu</span>

            <!-- X -->
            <svg v-if="isActive" xmlns="http://www.w3.org/2000/svg" 
            width="26" 
            height="26" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#fff" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line></svg>

            <!-- ||| -->
            <svg v-else class="menu" xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#fff" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
            <div v-if="!isActive" class="btn-bg"></div>
        <nav id="primary-nav" class="primary-nav" v-bind:class="{ 'is-active': isActive }">
            <router-link to="/landing" class="home-a">Home</router-link>
            <router-link to="/contact" class="contact-a">Contact</router-link>
            <router-link to="/login" class="login-a">Sign up</router-link>
        </nav>
    </header>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
      name: "LandingNavBar",
      data(){
        return {
            isActive: false,
        }},
  });
  </script>

<style>
.mobile-nav-toggle{
    display: none
}
header{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: #101719cc;
    backdrop-filter: blur(0.25rem);
    color: white;  
}
.logo{
    font-family: 'EB Garamond', serif;
    letter-spacing: 1px;
}
.primary-nav a{
    padding-bottom: 1em;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-inline-end: 1.5rem;
}
.primary-nav a:hover,
.primary-nav a:active{
    border-bottom: solid rgba(255, 255, 255, 0.604) 2px;
    opacity: 70%
}
.primary-nav a:last-child{
    margin-inline-end: 0;
}

@media (max-width:500px){
    header{
        background-color: rgba(255, 255, 255, 0);
        backdrop-filter: none;
    }
    .logo{
        display: none
    }
    .primary-nav{
        position: fixed;
        inset: 0 0 0 35%;
        display: flex;
        flex-direction: column;
        padding: min(30vh, 8rem) 3em;

        background: #101719cc;
        backdrop-filter: blur(0.25rem);

        transition: all 0.5s ease;
        transform: translateX(100%)
    }
    .primary-nav.is-active{
        transform: translateX(0)
    }
    .primary-nav a{
        margin-block: 0.75em
    }
    .mobile-nav-toggle{
        display: block;
        position: absolute;
        z-index: 9999;
        top: 1rem;
        right: 1rem
    }
    .btn-bg{
        position: absolute;
        z-index: 999;
        top:0;
        right: 0;
        width:4.5rem;
        height:4.5rem;
        border-bottom-left-radius: 6rem;
        background-color: #101719cc;
        backdrop-filter: blur(0.25rem);
    }
}
</style>