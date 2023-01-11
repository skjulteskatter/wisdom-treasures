<template>
    <body>
        <LandingNavBar/>
        <header>
            <div class="header-description">
                <h1>Wisdom Treasures</h1>
                <p>A short description of what WT is. 
                 En verktøykasse med verktøy (visdomsord)
                 som bygger på Ordet og som er egner seg til å 
                 skru på eget og andres liv.</p>
                <a href="#">sign up</a>
            </div>
            <div class="image-holder"></div>
        </header>

        <main>
            <section class="functionExampleSection"><h1>Get daily<br>wisdom words</h1></section>
            <section class="functionExampleSection white-v"><h1>Get manna</h1></section>
            <section class="functionExampleSection"><h1>Send to your friend</h1></section>
            <section class="functionExampleSection white-v"><h1>Add to a collection</h1></section>
            
            <section class="wisdomWordsSection">
                <h1>Wisdom</h1>
                <h1 class="second-line-h1">words</h1>

                <div class="arrows">
                <svg xmlns="http://www.w3.org/2000/svg" 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#000000" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round">
                    <path d="M19 12H6M12 5l-7 7 7 7"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#000000" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round">
                    <path d="M5 12h13M12 5l7 7-7 7"/>
                </svg>
                </div>
                
                <div class="wisdomWordsExamplesContainer">
                    <WisdomWordExample />
                    <WisdomWordExample />
                    <WisdomWordExample />
                    <WisdomWordExample />
                </div>
                
            </section>

            <section class="questionsSection">
                <div class="questions-text">
                    <h1>Have questions?</h1>
                    <h3>Write to us!</h3>
                </div>
                <form>
                    <input type="text">
                    <input type="email">
                    <textarea></textarea>
                </form>
            </section>

            <FooterComponent/>
        </main>
    </body>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import FooterComponent from '@/components/FooterComponent.vue';
import LandingNavBar from '@/components/LandingNavBar.vue';
import WisdomWordExample from '@/components/WisdomWordExample.vue';

    export default defineComponent({
      name: "LandingView",
      components: { FooterComponent, 
                    LandingNavBar, 
                    WisdomWordExample },
      methods: {

      }
});
</script>

<style>
    html{
        margin: 0
    }
    body{
        margin: 1em 0;
        background-color: white
    }

    /* typography */
    h1{
        font-size: 3rem;
        font-weight: bold;
        margin: 0;
    }
    .second-line-h1{
        margin-left: 2em;
        margin-top: -0.5em;
    }
    h3{
        font-size: 1.75rem
    }
    p{
        font-size: 1.25rem
    }

    /* header */
    header{
        height: 40em;
        display: flex;
        padding: 7em 5em;
        justify-content: space-between;
        align-items: center;
    }
    
    .header-description{
        max-width: 40%
    }
    /* links in the header */
    .header-description a{
        color: white;
        background-color: #3C3C4D;
        padding: 0.75em 3em;
        border-radius: 2em;
    }
    .image-holder{
        background-color: grey;
        width: 25%;
        height: 20em;
        margin-right: 10em
    }

/* functions display */
    .functionExampleSection{
        height: 20em;
        background-color: #6F6F6F;
        color: white;
        display: flex;
        align-items: center;
        padding: 7em 5em
    }
    .functionExampleSection.white-v{
        background-color: white;
        color: inherit;
        justify-content: end;
    }
/* wisdomWords Examples */
    .wisdomWordsSection{
        height: 30em;
        padding: 5em
    }
    .arrows{
        display: flex;
        justify-content: end;
    }
    .wisdomWordsExamplesContainer{
        display: flex;
        margin-top: 4em;
    }

/* questionsSection */
    .questionsSection{
        padding: 5em;
        height: 20em;
        display: flex;
        justify-content: space-between;
    }

    .questionsSection form{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .questionsSection input, textarea{
        border: none;
        border-bottom: 2px solid #3C3C4D;
        width: 30em;
        height: 3em
    }
    
</style>