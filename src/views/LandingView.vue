<template>
    <body>
        <LandingNavBar/>
        <main>
        <div id="parent">
            <!-- BANNER -->
            <section id="banner">
                <video autoplay muted loop>
                    <source src="https://crustac.fr/wp-content/themes/crustac/img/video_waves3.mp4" type="video/mp4">
                </video>
                <h2>WT</h2>
                <router-link to="/login" class="transition scale">Gods Word. The easy way.</router-link> <!-- HAHA funny, but no -->
            </section>


            <!-- INTRO -->
            <section id="intro">
                <p id="about">A little bit about</p>
                <div class="container">
                    <h1>Wisdom Treasures</h1>
                    <p>Our app is a toolbox with tools, Wisdom Words, 
                    that are built on Gods Word and are personalized to your life and needs.</p>
                </div>
                <router-link to="/login" class="transition">sign up</router-link>
                
            </section>

        </div> <!-- of #parent-->

            <!-- WW GALLERY  -->
            <div class="wisdomWordsSection">
                <p class="p-little">Examples of</p>
                <h1>Wisdom</h1>
                <h1 class="second-line-h1">words</h1>

                <!-- arrows -->
                <div class="arrows">
                    <button @click="scrollLeft">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="50" 
                        height="50" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#000000" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="transition scale">
                        <path d="M19 12H6M12 5l-7 7 7 7"/></svg>
                    </button>
                    <button @click="scrollRight">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="50" 
                        height="50" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#000000" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="transition scale">
                        <path d="M5 12h13M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
          
                <div ref="scrollContainer" class="wisdomWordsExamplesContainer snaps-inline scroll-container grab-bing" 
                    @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag">

                    <WisdomWordExample :author="author1" :content="content1"/>
                    <WisdomWordExample :author="author2" :content="content2"/>
                    <WisdomWordExample :author="author3" :content="content3"/>
                    <WisdomWordExample :author="author4" :content="content4"/>
                    <WisdomWordExample :author="author1" :content="content1"/>
                    <WisdomWordExample :author="author1" :content="content1"/>
                </div>
                
                
            </div>

            <!-- FUNCTION DISPLAY SECTION -->
            <section class="functionExampleSection"><h2 class="transition scale">Get daily<br>wisdom words</h2></section>
            <section class="functionExampleSection white-v"><h2 class="transition scale">Get manna</h2></section>
            <section class="functionExampleSection"><h2 class="transition scale">Send to your friend</h2></section>
            <section class="functionExampleSection white-v"><h2 class="transition scale">Add to a collection</h2></section>


            <!-- QUESTIONS SECTION -->
            <section class="questionsSection">
                <div class="questions-text">
                    <h1>Have questions?</h1>
                    <h3>Write to us!</h3>
                </div>
                <form>
                    <input type="text" placeholder="name" class="transition scale">
                    <input type="email" placeholder="e-mail" class="transition scale">
                    <textarea placeholder="type your message here" class="transition scale"></textarea>
                    <button><svg xmlns="http://www.w3.org/2000/svg" 
                        width="40" 
                        height="40" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#000000" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="transition scale">
                        <path d="M5 12h13M12 5l7 7-7 7"/>
                    </svg></button>
                </form>
            </section>

            <!-- BOTTOM -->
            <section id="scroll-top">
                <button class="scroll-to-top-btn transition scale" @click="scrollToTop">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="40" 
                        height="40" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#fff" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round">
                        <path d="M12 19V6M5 12l7-7 7 7"/>
                    </svg>
                    <p>Scroll to the top</p>
                </button>
                <video autoplay muted loop>
                    <source src="https://crustac.fr/wp-content/themes/crustac/img/video_waves3.mp4" type="video/mp4">
                </video>
            </section>
            
        </main>
        <footer>Copyright 2022 © Stiftelsen Skjulte Skatters Forlag. All Rights Reserved</footer>
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
            scrollToTop(){
                let currentScroll = document.documentElement.scrollTop,
                int = setInterval(frame, 4)

                function frame(){
                    if(0> currentScroll)
                        clearInterval(int)
                    else{
                        currentScroll = currentScroll - 24
                        document.documentElement.scrollTop = currentScroll
                    }
                }
            },
            // scrolling with buttons (arrows)
            scrollLeft() {
                (this.$refs.scrollContainer as HTMLElement).scrollTo({
                left: (this.$refs.scrollContainer as HTMLElement).scrollLeft - 500,
                behavior: 'smooth'
                })
            },
            scrollRight() {
                (this.$refs.scrollContainer as HTMLElement).scrollTo({
                left: (this.$refs.scrollContainer as HTMLElement).scrollLeft + 500,
                behavior: 'smooth'
                })
            },
            // scrolling with mouseup, -move and -down
            startDrag(event: MouseEvent) {
                this.isDown = true
                // Store the initial position of the mouse
                this.startX = event.pageX - (this.$refs.scrollContainer as HTMLElement).offsetLeft;
                this.divScrollLeft = (this.$refs.scrollContainer as HTMLElement).scrollLeft as number;
                (this.$refs.scrollContainer as HTMLElement).classList.remove('snaps-inline')
            },
            drag(event: MouseEvent) {
                if(!this.isDown) return;
                event.preventDefault();
                    const x = event.pageX - (this.$refs.scrollContainer as HTMLElement).offsetLeft;
                    const walk = x - this.startX;
                    (this.$refs.scrollContainer as HTMLElement).scrollLeft = this.divScrollLeft - walk
            },
            endDrag() {
                this.isDown = false;
                (this.$refs.scrollContainer as HTMLElement).classList.add('snaps-inline')
            }
        }, data() {
            return {
                author1: 'Johan O. Smith',
                author2: 'Sigurd Bratlie',
                author3: 'Kåre J. Smith',
                author4: 'Johan O. Smith',
                content1: 'Om du griper visdommen, vil du snart være et produkt av dens behandling.',
                content2: 'Det å bli døpt med den Hellige Ånd tar ikke bort selvfornektelsens lidelse. Nei, men det gir deg kraft til å lide i kjødet. ',
                content3: 'Som prest kan en ofre i sitt eget selvliv slik at en blir bevart i kjærligheten. Men skal en være konge, og ikke bare prest, da må en kunne si ifra og være et hode. Da blir det onde bundet der hvor en er.',
                content4: 'Du kan i løpet av fem minutter si så meget ondt, at ikke fem år kan få helbredet det brutte samfund og få oprettet tillitsforholdet.',
                startX: 0,
                startY: 0,
                isDown: false as boolean,
                divScrollLeft: 0,
            }
        },
});
</script>

<style>
    html{
        margin: 0}
    body{
        margin: 1em 0;
        background-color: white;
        height: 100vh}
/* HEX COLOR PALETE?? */
/* --charleston-green: #202D31ff;
--cadet-blue-crayola: #A5B3BEff;
--deep-space-sparkle: #385B63ff;
--cafe-noir: #533924ff;
--charcoal: #2B4453ff; */


/* TYPOGRAPHY */
    h1, h2 {
        font-size: 3rem;
        font-weight: bold;
        margin: 0;
        letter-spacing: 2px;
    }
    h1{
        font-size: 4rem;
        line-height: 5rem;
    }
    .second-line-h1{
        margin-left: 2em;
        margin-top: -0.25em;
    }
    h3{
        font-size: 2rem
    }
    p{
        font-size: 1.25rem
    }


    #parent{
        display: grid;
        grid-template-rows: 100vh 30em;
    }
/* BANNER */
    #banner{
        grid-row: 1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center; 
        clear: both
    }
    #banner video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        object-fit: cover;
        opacity: 70%
    }
    #banner h2{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        font-size: 35vw;
        text-align: center;
        text-transform: uppercase;
        line-height: 100vh;
        mix-blend-mode: screen;
    }
    #banner a{
        position: absolute;
        top: 43vh;
        left: 0;
        width: 100%;
        height: 100%;
        background: none;
        font-size: 5rem;
        text-align: center;
        font-family: 'EB Garamond', serif;
    }



/* INTRO */
    #intro{
        grid-row: 2;
        position: absolute;
        top: 20vh;
        left: 0;
        width: 100%;
        height: 20em;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #about {
        font-family: 'EB Garamond', serif;
        padding-right: 15em;
        margin-bottom: -7em
    }
    .container{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 4em
    }
    .container h1{
        width: 40%;
        text-align: right;
        padding-right: 1em;
        font-family: 'EB Garamond', serif;
        font-size: 5rem
    }
    .container p {
        width: 40%;
        padding: 4em 0 8em 4em;
        margin-top: 5em;
        border-left: 1px solid #2B4453
    }
    #intro a{
        color: #2B4453;
        background-color: white;
        border: 3px #2B4453 solid;
        padding: 0.75em 4em;
        border-radius: 2em;
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: bold;
        letter-spacing: 3px;
        margin-top: -12em
    }
    #intro a:hover, 
    #intro a:active,
    #intro a:focus{
        background-color: #2B4453;
        color: white
    }


/* WW Examples section*/
    .wisdomWordsSection{
        padding: 7em 5em
    }
    .wisdomWordsSection h1{
        font-size: 5rem
    }
    .p-little {
        font-family: 'EB Garamond', serif;
        font-size: 1.75
    }
    .arrows{
        display: flex;
        justify-content: flex-end;   
    }
    .wisdomWordsExamplesContainer{
        padding-block: 3em;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 40%;
        gap: 2.5%;
        overflow-x: scroll;
        overscroll-behavior-inline: contain;
        width: 100%;
    }
/* cursor */
    .grab-bing {
        cursor : -webkit-grab;
        cursor : -moz-grab;
        cursor : -o-grab;
        cursor : grab;
    }
    .grab-bing:active {
        cursor : -webkit-grabbing;
        cursor : -moz-grabbing;
        cursor : -o-grabbing;
        cursor : grabbing;
    }
/* snapping */
    .snaps-inline{
        scroll-snap-type: inline mandatory;
        transition: smooth all 0.5s;
    }
    .snaps-inline > * {
        scroll-snap-align: start;
    }


    /* functions display */
    .functionExampleSection{
        height: 20em;
        background-color: #202D31;
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


/* questionsSection */
    .questionsSection{
        padding: 7em 5em;
        display: flex;
        justify-content: space-between;
    }
    .questionsSection form{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .questionsSection input, textarea{
        margin-bottom: 1em;
        border: none;
        border-bottom: 2px solid #2B4453;
        width: 30em;
        height: 3em
    }
    .questionsSection textarea{
        height: 6em
    }
    .questionsSection button {
        margin-top: 1em;
        opacity: 75%;
        align-self: flex-end;
    }

    /* scroll to the top */
    #scroll-top {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 15em;
        position: relative;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.486);
    }
    #scroll-top video {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
        background-color: #2B4453;
    }
    .scroll-to-top-btn{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;
        text-transform: uppercase;
        letter-spacing: 3px
    }
    .scroll-to-top-btn:hover,
    .scroll-to-top-btn:active,
    .scroll-to-top-btn:focus {
        cursor: pointer;
        opacity: 60%
    }
    footer{
        text-align: center;
        padding: 2em;
        background-color: #202D31;
        color: white;
        font-size: 0.75rem
    }


    /* transform + scale */
    .transition{
        transition: all 0.25s
    }
    .scale:hover,
    .scale:active,
    .scale:focus{
        transform: scale(1.1)
    }


    /* scrollbar */
    ::-webkit-scrollbar{
        width: 1em;
        height: 1em
    }
    ::-webkit-scrollbar-track{
        background: #f6f6f6;

    }
    ::-webkit-scrollbar-thumb{
        background: #2B4453;
        border-radius: 100vw;
        border: solid 4px #f6f6f6;
    }

</style>