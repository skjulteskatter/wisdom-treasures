<template>
    <body>
        <LandingNavBar/>
        <main>
        <div id="parent">
            <!-- BANNER -->
            <section id="banner">
                <div style="width:100%;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/LrG5hpEkf2XqjyK4AY" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>              
                <h2>WT</h2>
                <router-link to="/login" class="transition scale-s">Gods Word. The easy way.</router-link> <!-- HAHA funny, but no -->
                <button class="scroll down" @click="scrollDown">
                    <p>scroll</p>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#fff" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round">
                    <path d="M6 9l6 6 6-6"/></svg>
                </button>
            </section>


            <!-- INTRO -->
            <section ref="intro" id="intro" >
                <p id="about" class="p-little">A little bit about</p>
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
                <p class="p-little color-white">Examples of</p>
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
                        stroke="#fff" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="transition scale-b">
                        <path d="M19 12H6M12 5l-7 7 7 7"/></svg>
                    </button>
                    <button @click="scrollRight">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="50" 
                        height="50" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#fff" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="transition scale-b">
                        <path d="M5 12h13M12 5l7 7-7 7"/></svg>
                    </button>
                </div>

                    <div ref="scrollContainer" class="wisdomWordsExamplesContainer snaps-inline scroll-container grab-bing" 
                        @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag">
                        <WisdomWordExample :author="author2" :content="content2" :imgSrc="imgSrc2"/>
                        <WisdomWordExample :author="author3" :content="content3" :imgSrc="imgSrc3"/>
                        <WisdomWordExample :author="author1" :content="content1" :imgSrc="imgSrc1"/>
                        <WisdomWordExample :author="author4" :content="content4" :imgSrc="imgSrc1"/>
                        <WisdomWordExample :author="author1" :content="content1" :imgSrc="imgSrc1"/>
                        <WisdomWordExample :author="author1" :content="content1" :imgSrc="imgSrc1"/>
                    </div>

            </div>

            <!-- FUNCTION DISPLAY SECTION -->
            <section class="functionExampleSection">
                <h2>Get daily <span>wisdom words</span></h2>
                <div class="img-container"><img src="images/home-page.png"/><div class="back-div"></div></div></section>
            <section class="functionExampleSection">
                <h2>Get manna</h2><div class="img-container"><img src="images/home-page.png"/><div class="back-div"></div></div></section>
            <section class="functionExampleSection">
                <h2>Send to your friend</h2><div class="img-container"><img src="images/home-page.png"/><div class="back-div"></div></div></section>
            <section class="functionExampleSection">
                <h2>Add to a collection</h2><div class="img-container"><img src="images/home-page.png"/><div class="back-div"></div></div></section>


            <!-- QUESTIONS SECTION -->
            <section class="questionsSection">
                <div class="questions-text">
                    <h1>Have questions?</h1>
                    <h3>Write to us!</h3>
                </div>
                <form>
                    <input type="text" placeholder="name" class="transition scale-s">
                    <input type="email" placeholder="e-mail" class="transition scale-s">
                    <textarea placeholder="type your message here" class="transition scale-s"></textarea>
                    <button><svg xmlns="http://www.w3.org/2000/svg" 
                        width="40" 
                        height="40" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#000000" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="transition scale-b">
                        <path d="M5 12h13M12 5l7 7-7 7"/>
                    </svg></button>
                </form>
            </section>

            <!-- BOTTOM -->
            <section id="scroll-top">
                <button class="scroll scroll-to-top-btn transition scale" @click="scrollToTop">
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
            scrollDown(){
                let element = this.$refs.intro as HTMLElement,
                    offset = 150; // 50 pixels above the element
                window.scrollBy({
                    top: element.offsetTop - offset,
                    behavior: 'smooth'
                });
            },
            // scrolling with buttons (arrows)
            scrollLeft() {
                (this.$refs.scrollContainer as HTMLElement).scrollTo({
                left: (this.$refs.scrollContainer as HTMLElement).scrollLeft - 400,
                behavior: 'smooth'
                });
                (this.$refs.scrollContainer as HTMLElement).classList.add('snaps-inline')
            },
            scrollRight() {
                (this.$refs.scrollContainer as HTMLElement).scrollTo({
                left: (this.$refs.scrollContainer as HTMLElement).scrollLeft + 400,
                behavior: 'smooth'
                });
                (this.$refs.scrollContainer as HTMLElement).classList.add('snaps-inline')
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
                imgSrc1: "images/JOS.webp",
                imgSrc2: "images/SB.webp",
                imgSrc3: "images/KJS.jpg",
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
        margin: 0;
        background-color: white;
        height: 100vh;
    }

/* HEX COLOR PALETE?? */
/* --charleston-green: #202D31ff;
--cadet-blue-crayola: #A5B3BEff;
--deep-space-sparkle: #385B63ff;
--cafe-noir: #533924ff;
--charcoal: #2B4453ff; */


/* TYPOGRAPHY */
    h1, h2 {
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
    h2{
        font-size: 3rem
    }
    h3{
        font-size: 2rem
    }
    p{
        font-size: 1.25rem
    }
    .p-little {
        font-family: 'EB Garamond', serif;
    }
    .color-white{
        color: #fff
    }

    #parent{
        display: grid;
        grid-template-rows: 100vh 40em;
    }
/* BANNER */
    #banner{
        grid-row: 1;
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden
    }
    #banner iframe {
        position: absolute;
        top: 0;
        left: 0;
        min-width: 100%;
        height: 100vh;
    }
    #banner h2{
        color:rgba(255, 255, 255, 0.284);
        background-color: #202d31aa;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        font-size: max(12rem, 35vw);
        text-align: center;
        text-transform: uppercase;
        line-height: 100vh;

        backdrop-filter: blur(10px);
    }
    #banner a{
        position: absolute;
        top: 43vh;
        left: 0;
        width: 100%;
        height: 100%;
        background: none;
        font-size: 7vw;
        text-align: center;
        font-family: 'EB Garamond', serif;
        color: #fff;
    }
    .scroll.down{
        position: absolute;
        bottom:1em;
        width:100%;
    }


/* INTRO */
    #intro{
        grid-row: 2;
        position: absolute;
        top: 27vh;
        left: 0;
        width: 100%;
        height: 50vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #about {
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
        padding: 4em 4em 8em 4em;
        margin-top: 5em;
        border-left: 2px solid #2B4453
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
    

/* WW Examples section */
    .wisdomWordsSection{
        padding: 7em 5em;
        background-color:#202D31
    }
    .wisdomWordsSection h1{
        font-size: 5rem;
        color: #fff;
        text-shadow: black 4px 4px 3px;
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
    .wisdomWordsExamplesContainer::-webkit-scrollbar{
        display: none;
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

    .my-transition-enter-active {
        transition: all 300ms;
    }
    .my-transition-enter {
        scroll-snap-type: none;
    }
    .my-transition-enter-to {
        scroll-snap-type: inline mandatory;
    }

/* functions display */
    .functionExampleSection{
        background-color: #fff;
        color: inherit;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 5em;
        height: 60vh;
        border-bottom: 1px solid #2b44532c;
        transition: all 0.35s
    }
    .functionExampleSection:hover{
        height: 70vh
    }
    .functionExampleSection span{
        font: inherit;
        display: inline-block
    }
    .img-container{
        width:50%;
        height:80%;
        border-radius: 10em;
        display: flex;
        justify-content: center;
        align-items: baseline;
        overflow: hidden;
        transition: all 0.35s;
    }
    .img-container .back-div{
        position: absolute;
        bottom:-12em;
        left:10;
        border-radius: 50%;
        width: 90%;
        height: 150%;
        background-color:#2B4453;
    }
    .functionExampleSection img{
        width:45%;
        object-fit: cover;
        transition: all 0.5s;
        transform: skewX(-25deg);
        border-radius: 1em;
        z-index: 1
    }
    .functionExampleSection img:hover{
        transform: skewX(-15deg) translateY(-2em)
    }
    .img-container::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100%;
        background: rgba(255, 255, 255, 0.356);
        transform: skewX(45deg) translateX(42em);
        transition: 0.5s;
        z-index: 1
    }
    .img-container:hover::before{
        transform: skewX(45deg) translateX(-15em)
    }


/* questionsSection */
    .questionsSection{
        padding: 7em 5em;
        display: flex;
        justify-content: space-between;
    }
    .questionsSection h1{
        margin: 0 1em 0.25em 0;
        line-height: 1em;
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
        width: 40vw;
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

/* TYPING ANIMATION */
    :root {
        --bg-color: white;
        --typewriterSpeed: 8s;
        --typewriterCharacters: 12;
    }
    .questions-text h3 {
        font-size: clamp(1.2rem, 1.8vw + 0.6rem, 2.4rem);
        position: relative;
        font-family: "Source Code Pro", monospace;
        width: max-content;
    }
    .questions-text h3::before,
    .questions-text h3::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .questions-text h3::before {
        background: white;
        animation: typewriter var(--typewriterSpeed)
            steps(var(--typewriterCharacters)) infinite;
    }
    .questions-text h3::after {
        width: 0.08em;
        height: 90%;
        background: black;
        animation: typewriter var(--typewriterSpeed)
            steps(var(--typewriterCharacters)) infinite,
            blink 750ms steps(var(--typewriterCharacters)) infinite;
    }
    @keyframes typewriter {
        0% {
            left: 0%;
        }
        40%, 100%{
            left: 100%;
        }
    }

    @keyframes blink {
        to {
            background: transparent;
        }
    }

/* SCROLL TO TOP */
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
    .scroll{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;
        text-transform: uppercase;
        letter-spacing: 3px
    }
    .scroll:hover,
    .scroll:active,
    .scroll:focus {
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


/* TRANSITION, SCALE */
    .transition{
        transition: all 0.25s
    }
    .scale-b:hover,
    .scale-b:active,
    .scale-b:focus{
        transform: scale(1.2)
    }
    .scale-s:hover,
    .scale-s:active,
    .scale-s:focus{
        transform: scale(1.05)
    }


/* SCROLLBAR */
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





/* MEDIA QUERIES */
    @media only screen and (max-width: 1024px){
        .container h1 {
            width: 50%;
            font-size: 4.5rem
        }
        .container p {
            width: 50%
        }
        #about{
            padding-right: 14.5em; 
            margin-bottom: -8em
        }
        h1{
            line-height: 4rem;
        }
        .second-line-h1{
            margin-left: 2em;
            margin-top: 0em;
        }
        .wisdomWordsSection{
            padding: 7em 3em
        }
        .functionExampleSection{
            margin: 0 3em;
            padding: 0
        }
        .functionExampleSection .back-div {
            height:130%;
            width: 110%
        }
        .questionsSection{
            padding: 7em 3em
        }
        
    }
    @media only screen and (max-width: 810px){
        .container h1{
            padding-right: 0.5em;
            font-size: 4rem
        }
        .container p {
            padding: 4em 1.5em 8em 2em;
            /* margin-top: 5em; */
        }
        #about{
            padding-right: 10em;
            margin-bottom: -9em
        }
        .wisdomWordsSection h1{
            font-size: 4rem;
            line-height: 3rem;
        }
        .wisdomWordsExamplesContainer {
            grid-auto-columns: 55%;
        }

        .functionExampleSection h2{
            font-size: 2.6rem;
            align-self: flex-start;
            margin-top: 0.5em
        }
        .functionExampleSection{
            height: 50vh;
            flex-direction: column-reverse;
            margin: 0;
            margin: 2em 3em
        }
        .img-container{
            width:100%;
        }
        .img-container img{
            position: absolute;
            top: -4em
        }
        .img-container .back-div{
            height:160%
        }
        .questionsSection{
            flex-direction: column;
        }
        .questionsSection h1{
            margin-bottom: 0.1em
        }
        .questionsSection form{
            align-self: flex-end;
        }
        .questionsSection input, textarea{
            width: 50vw
        }
        #scroll-top{
            height: 12em;
        }
        footer{
            padding: 1.75em
        }
    }
    @media only screen and (max-width: 670px){
        #banner a{
            top: 47vh;
        }

        /* INTRO */
        #intro{
            text-align: center;
            height: 60vh;
        }
        #about {
            padding-right: 0;
            margin-bottom: 0;
        }
        .container{
            flex-direction: column;
            margin: 0;
        }
        .container h1{
            padding-right: 0em;;
            margin-inline: 1em;
            text-align: center;
            width: auto
        }
        .container p {
            width: 80%;
            padding-block: 2em;
            margin-top: 2em;
            border-left: none;
            border-top: 2px solid #2B4453;
        }
        #intro a{
            margin-top: 0;
        }


        .second-line-h1{
            margin-bottom: 0.5em
        }
        .wisdomWordsExamplesContainer {
            grid-auto-columns: 70%;
            gap: 4%
        }
        .wisdomWordsSection{
            padding: 9em 2em
        }
        .functionExampleSection{
            margin: 2em 2em;
        }
        .img-container img{
            width: 30%;
            top: -1.5em
        }
        .questionsSection{
            padding: 5em 2em
        }

        .questionsSection h1{
            font-size: 3.6rem;
            margin: 0
        }
        h3{
            font-size: 1.8rem;
            margin: 0.5em 0 1em 0
        }
        .questionsSection input, textarea{
            width: 88vw;
        }
        .questionsSection form{
            align-self: center;
        }
        .scroll-to-top-btn p{
            font-size: 1rem
        }
    }
    @media only screen and (max-width: 500px){

    }
</style>