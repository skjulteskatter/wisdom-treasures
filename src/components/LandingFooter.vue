<template>
    <footer>
            <div class="links-footer">
                <router-link to="/landing">Home</router-link>
                <router-link to="/insight">Insight</router-link>
                <router-link to="/contact">Contact</router-link>
                <router-link to="/terms-of-purchase">Terms of Purchase</router-link>
                <router-link to="/privacy-policy">Privacy Policy</router-link>
            </div>
            <div class="logo-and-copyright">
                <div class="footer-logo">
                    <img src="/img/logo.svg" class="drop-shadow" @click="navigate('<!-- what should we have here? --> landing')"/>
                    <p class="drop-shadow"><span>Wisdom</span> Treasures</p>
                </div>
                <p class="copyright">Copyright 2023 © Stiftelsen Skjulte Skatters Forlag.<br>All Rights Reserved</p>
            </div>
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
        display: flex;
        justify-content: space-between;
        padding-block: 3em;
        padding-inline: var(--pad-inline);
        background: var(--darker-primary);
        color: white;
        font-size: 1rem
    }
    .links-footer{
        display: flex;
        flex-direction: column
    }
    footer a{
        margin-bottom:0.2em;
    }
    footer a:hover{
        text-decoration: underline;
    }
    .logo-and-copyright{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .footer-logo{
        display: flex;
        align-items: center;
    }
    .footer-logo img{
        height: 4em;
        margin-right: 1em
    }
    .footer-logo p{
        text-transform: uppercase;
        font-weight: bold
    }
    .footer-logo span{
        display: block;
        font-weight: bold;
        color: #54808c
    }
    footer p{
        font-size: 1rem
    }
    @media(max-width:600px){
        footer{
            flex-direction: column;
            padding-block: 2em;
        }
        .footer-logo{
            margin-block: 1.5em
        }
        .copyright{
            font-size: .75rem;
            text-align: center;
        }
    }
    </style>