<template>
    <header>
        <div class="header-inner">

            <div class="logo-with-text">
                <img class="h-12 min-w-[2.5rem] cursor-pointer" src="/img/logo.svg" @click="navigate('<!-- idk? --> landing')"/>
                <p class="hidden sm:block" @click="navigate('')"><span>Wisdom</span>Treasures</p>
            </div>
            
            <button class="mobile-nav-toggle" 
                    aria-controls="primary-nav" @click="isActive = !isActive">
                <span class="sr-only">Menu</span>

                <!-- X -->
                <svg v-if="isActive" xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#3D6E7C" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line></svg>

                <!-- ||| -->
                <svg v-else class="menu" xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#3D6E7C" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line></svg>
            
            </button>

            <nav id="primary-nav" class="primary-nav" v-bind:class="{ 'is-active': isActive }">
                <router-link to="/landing" class="home-a">Home</router-link>
                <router-link to="/insight" class="insight-a">Insight</router-link>
                <router-link to="/contact" class="contact-a">Contact</router-link>
                <router-link to="/login" class="login-a">Log in</router-link>
            </nav>

        </div>
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
    
    padding-block: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: solid 1px var(--medium-grey);
    background-color: white;
}
.header-inner{
    width: 100%;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: var(--pad-inline);
}
.logo-with-text{
    display: flex;
    align-items: center;
}
.logo-with-text p{
    font-size: .9rem;
    line-height: 1.2em;
    margin-left: 1em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}
.logo-with-text span{
    display: block;
    font-weight: bold;
    color: var(--primary-clr);
}
.primary-nav a{
    margin-inline-end: 1.5rem;
    font-weight: bold
}
.primary-nav a:hover{
    text-decoration:underline
}
.primary-nav a:last-child{
    margin-inline-end: 0;
    padding: .45em 2.2em;
    border-radius: 4em;
    background: var(--primary-clr);
    color: white;
    font-weight:unset;
}
.primary-nav a:last-child:hover{
    background-color: var(--darker-primary);
}


@media (max-width:600px){
    .logo{
        display: none
    }
    .primary-nav{
        position: fixed;
        inset: 0 0 0 35%;
        display: flex;
        flex-direction: column;
        padding: min(30vh, 8rem) 3em;
        background-color: #ffffffed;
        
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
        z-index: 9999;
    }
}
</style>