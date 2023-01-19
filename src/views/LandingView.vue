<template>
    <body>
        <LandingNavBar/>
        <main>
            <!-- BANNER -->
            <section id="banner">
                <video autoplay muted loop>
                    <source src="https://crustac.fr/wp-content/themes/crustac/img/video_waves3.mp4" type="video/mp4">
                </video>
                <h2>WT</h2>
            </section>


            <!-- INTRO -->
            <section id="intro">
                    <h1 id="title">Wisdom Treasures</h1>
                    <p>A short description of what WT is. 
                    En verktøykasse med verktøy (visdomsord)
                    som bygger på Ordet og som er egner seg til å 
                    skru på eget og andres liv.</p>
                    <router-link to="/login" class="transition scale">sign up</router-link>
            </section>


            <!-- WW GALLERY  -->
            <div class="wisdomWordsSection">
                <h1>Wisdom</h1>
                <h1 class="second-line-h1">words</h1>

                <!-- arrows -->
                <div class="arrows">
                    <button @click="scrollLeft">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="40" 
                        height="40" 
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
                        width="40" 
                        height="40" 
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
          
                <div ref="scrollContainer" class="wisdomWordsExamplesContainer snaps-inline scroll-container" >
                    <WisdomWordExample :author="author1" :content="content1"/>
                    <WisdomWordExample :author="author2" :content="content2"/>
                    <WisdomWordExample :author="author3" :content="content3"/>
                    <WisdomWordExample :author="author4" :content="content4"/>
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
                    <svg xmlns="http://www.w3.org/2000/svg" 
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
                    </svg>
                </form>
            </section>

            <!-- BOTTOM -->
            <section class="scroll-to-top transition scale" @click="scrollToTop">
                <svg xmlns="http://www.w3.org/2000/svg" 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#000000" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round">
                    <path d="M12 19V6M5 12l7-7 7 7"/>
                </svg>
                <p>Scroll to the top</p>
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
            }

            // drag&drop functions
            // dragStart(e){
            //     this.dragging = true;
            //     this.mouseLocation = e.pageX
            //     this.galleryLocation = this.wrapper.scrollLeft
            //     console.log(this.galleryLocation)
            // },
            // dragActive(e){
            //     if(!this.dragging) return;

            //     let offset = e.pageX - this.mouseLocation;
            //     this.wrapper.scrollLeft = this.galleryLocation - offset
            // },
            
            // dragStop(e){
            //     this.dragging = false;
            //     this.mouseLocation = e.pageX
            //     this.galleryLocation = this.wrapper.scrollLeft
            // },
            // @mousedown="dragStart" @mouseup="dragStop" @mousemove="dragActive" - add to html

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

                // // drag&drop
                // wrapper: this.$refs.wrapper as HTMLElement,
                // dragging: false as boolean,
                // mouseLocation: 0 as number,
                // galleryLocation: 0 as number,
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


/* scrollbar */
    ::-webkit-scrollbar{
        width: 1em;
        height: 1em
    }
    ::-webkit-scrollbar-track{
        background: #f6f6f6;

    }
    ::-webkit-scrollbar-thumb{
        background: #949494;
        border-radius: 100vw;
        border: solid 4px #f6f6f6;
    }

/* TYPOGRAPHY */
    h1, h2 {
        font-size: 3rem;
        font-weight: bold;
        margin: 0;
        letter-spacing: 2px;
        line-height: 1em;
    }
    h1{
        font-size: 4rem
    }
    .second-line-h1{
        margin-left: 2em;
    }
    h3{
        font-size: 2rem
    }
    p{
        font-size: 1.25rem
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



/* BANNER */
#banner{
    position: absolute;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center; 
}
#banner video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    object-fit: cover;
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




/* INTRO */
    #intro{
        height: 40em;
        display: flex;
        flex-direction: column;
        padding: 0 20em;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    #intro p {
        margin: 2em 0
    }
/* link in the intro */
    #intro a{
        color: white;
        background-color: #8a8a8a;
        padding: 1em 4em;
        border-radius: 2em;
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: bold;
        letter-spacing: 1.75px;
    }
    #intro a:hover, 
    #intro a:active,
    #intro a:focus{
        background-color: #6f6f6f;
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
/* wisdomWords Examples section*/
    .wisdomWordsSection{
        padding: 7em 5em
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

/* snapping */
    .snaps-inline{
        scroll-snap-type: inline mandatory;
    }
    .snaps-inline > * {
        scroll-snap-align: start;
    }

/* questionsSection */
    .questionsSection{
        padding: 14em 5em;
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
        border-bottom: 2px solid #3C3C4D;
        width: 30em;
        height: 3em
    }
    .questionsSection svg {
        margin-top: 1em;
        opacity: 75%;
        align-self: flex-end;
    }

    /* scroll to the top */
    .scroll-to-top{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 5em 
    }
    .scroll-to-top:hover,
    .scroll-to-top:active,
    .scroll-to-top:focus {
        cursor: pointer;
        opacity: 60%
    }
</style>