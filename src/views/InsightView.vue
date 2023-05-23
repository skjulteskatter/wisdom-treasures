<template>
    <body class="contact">
      <LandingNavBar />
      <div class="text-insight-container">
        <h1>Get insight</h1>
        <p>Follow along with the latest developments of the project and 
            be updated on new content and features in the app.</p>
      </div>
      
        <div class="insight-out">
            <div class="insight-cont">
                <p class="insight-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p class="insight-date">22. juli 2022</p>
                <p class="insight-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Vestibulum molestie tortor ipsum, vitae suscipit ex varius eget.</p>
                <p class="insight-read-more">Read More ></p>

                <p class="insight-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p class="insight-date">22. juli 2022</p>
                <p class="insight-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Vestibulum molestie tortor ipsum, vitae suscipit ex varius eget.</p>
                <p class="insight-read-more">Read More ></p>

                <p class="insight-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p class="insight-date">22. juli 2022</p>
                <p class="insight-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Vestibulum molestie tortor ipsum, vitae suscipit ex varius eget.</p>
                <p class="insight-read-more insight-read-more-last" >Read More ></p>

                <router-link to="/login" class="insight-a">> See more</router-link>
            </div>
        </div>
      <LandingFooter class="contact-footer"/>
    </body>
  </template>
    
    <script lang="ts">
    import { defineComponent } from 'vue';
    import LandingNavBar from '@/components/LandingNavBar.vue';
    import LandingFooter from '@/components/LandingFooter.vue';
  
  
      export default defineComponent({
        name: "InsightView",
        components: { LandingNavBar, LandingFooter}
      })
  
    </script>
    
<style>
*{
  margin:0;
  padding:0
}
:root{
        --primary-clr: #3D6E7C;
        --darker-primary: #33606C;
        --accent-clr: #BB9758;
        --darker-accent: #ab884c;
        --very-light-grey: #f7f7f7;
        --light-grey: #f4f4f4;
        --medium-grey: #D9D9D9;
        --light-blue: #EAF3F5;

        --pad-block: 4em;
        --pad-inline: 5.5em;
    }
    @media(max-width: 925px){
        :root{
            --pad-inline: 3em;
        }
    }
    @media(max-width: 600px){
        :root{
            --pad-inline: 2em;
        }
    }
    html{
        margin: 0}
    body{
        margin: 0;
        background-color: white;
    }
    /* TYPOGRAPHY */
    h1{
        font-size: clamp(2rem, 6vw, 3.5rem);
        font-weight: bold;
        letter-spacing: 1px;
    }
    h2{
        font-size: clamp(2rem, 4vw, 3.5rem);
        font-weight: bold;
        line-height: 4rem;
    }
    h3{
        font-size: 1.5rem;
        font-weight: bold
    }
    p{
        font-size: 1.15rem
    }

    .text-insight-container{
        width: 60%;
        padding-inline: var(--pad-inline);
        padding-top: 20vh
    }
    @media(max-width:800px){
        .text-insight-container{
            width: 80%;}
    }
    @media(max-width:800px){
        .text-insight-container{
            width: 100%;}
    }
    /* .text-insight-container::before{
        content: '';
        position: absolute;
        bottom: 4.75em;
        right:13em;
        width: 12em;
        height: 1.5em;
        background: var(--accent-clr);
    } */
    .insight-out{
        padding-inline: var(--pad-inline);
        padding-block: var(--pad-block);
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: solid var(--light-grey) 1px;
    }
    .insight-cont{
        width: 100%;
        padding: 3em;
        border-radius: 1em;
        background-color: white;
        box-shadow: 0 0 25px #00000031;
        z-index: 1;
    }
    @media(max-width:600px){
        .insight-cont{
            padding:2em
        }
    }
    .insight-title{
        font-weight:bold;
        margin-top: 1em
    }
    .insight-date{
        font-size:.8rem
    }
    .insight-text{
        font-size: 1rem;
        margin-top: 1em
    }
    .insight-read-more{
        font-size: .8rem;
        margin-top: 1em
    }
    .insight-read-more-last{
        margin-bottom: 3em
    }
    .insight .insight-a{
        display:inline-block;
        padding: .6em 2em;
        border-radius: 4em;
        background-color: var(--accent-clr);
        color: white;

        transition: all .25s
    }
    .insight .insight-a:hover{
        transform: scale(1.1);
        transform-origin: center center
    }
</style>