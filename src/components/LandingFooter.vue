<template>
    <footer>
        <div class="footer-top-container">
            <div class="links-footer">
                <router-link to="/terms-of-purchase" class="">Terms of Purchase</router-link>
                <router-link to="/privacy-policy" class="">Privacy Policy</router-link>
                <router-link to="/contact" class="">Contact</router-link>
            </div>
            <div class="footer-logo">WT</div>
        </div>
        <p>Copyright 2022 © Stiftelsen Skjulte Skatters Forlag. <span>All Rights Reserved</span></p>
    </footer>
</template>
    
    <script lang="ts">
    import { defineComponent } from 'vue';  
  
      export default defineComponent({
        name: "LandingFooter",
      })
  
    </script>
    
    <style>
    *{
      margin:0;
      padding:0
    }
    footer{
        padding: 3em 7em 1em 7em;
        background-color: #202D31;
        color: white;
    }
    .footer-top-container{
        display: flex;
        justify-content: space-between;
    }
    .links-footer{
        display: flex;
        flex-direction: column
    }
    footer a{
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom:0.2em;
        font-size: 0.6rem;
    }
    footer a:hover{
        text-decoration: underline;
    }
    .footer-logo{
        font-size: 1.75rem
    }
    footer p{
        text-align: center;
        font-size: 0.8rem
    }
    </style>