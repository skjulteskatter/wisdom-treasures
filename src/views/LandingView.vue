<template>
    <body>
        <LandingNavBar/>
        <main>
        <div id="parent">
            <!-- BANNER -->
            <section id="banner">
                <!-- <button class="scroll down" @click="scrollDown">
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
                </button> -->
                <video autoplay muted loop>
                    <source src="images/phone-walking.mp4" type="video/mp4">
                </video>
            </section>


            <!-- INTRO -->
            <section ref="intro" id="intro">
                <h1>Wisdom Treasures</h1>
                <p>Our app is a toolbox with tools, Wisdom Words, 
                that are built on Gods Word and are personalized to your life and needs.</p>
                <router-link to="/login" class="transition">sign up</router-link>
                
            </section>

        </div> <!-- of #parent-->

            <!-- WW GALLERY  -->
            <div class="wisdomWordsSection">
                <!-- background -->
                <div class="ww-color-div-0"></div>
                <div class="ww-color-div-1"></div>
                <div class="ww-color-div-2"></div>
                <div class="ww-color-div-3"></div>

                <p class="color-white">Examples of</p>
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
                <div class="img-container"><img src="images/home-page.png"/>
                    <div class="color-div-1"></div><div class="color-div-2"></div></div></section>
            <section class="functionExampleSection img-left">
                <h2>Get manna</h2><div class="img-container"><img src="images/home-page.png"/>
                    <div class="color-div-1"></div><div class="color-div-2"></div></div></section>
            <section class="functionExampleSection">
                <h2>Send to your friend</h2><div class="img-container"><img src="images/home-page.png"/>
                    <div class="color-div-1"></div><div class="color-div-2"></div></div></section>
            <section class="functionExampleSection img-left">
                <h2>Add to a collection</h2><div class="img-container"><img src="images/home-page.png"/>
                    <div class="color-div-1"></div><div class="color-div-2"></div></div></section>


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
                    <source src="images/phone-walking.mp4" type="video/mp4">
                </video>
            </section>
            
        </main>
        <LandingFooter />
    </body>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import LandingNavBar from '@/components/LandingNavBar.vue';
import WisdomWordExample from '@/components/WisdomWordExample.vue';
import LandingFooter from '@/components/LandingFooter.vue';

    export default defineComponent({
      name: "LandingView",
      components:{  LandingFooter,
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
    }

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
    .color-white{
        color: #fff
    }

    #parent{
        display: flex;
    }
/* BANNER */
    #banner{
        width: 35%;
        height: 100vh;
    }
    #banner video{
        height: 100%;
        width:100%;
        object-fit: cover;
        background-color: #2B4453;
    }
    .scroll.down{
        position: absolute;
        bottom:1em;
        width:100%;
        z-index:3
    }
    .scroll.down p{
        font-size: 1rem
    }


/* INTRO */
    #intro{
        width: 65%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 4em
    }
    #intro h1{
        margin-top: 0.75em;
        font-size: 4.5rem;
    }
    #intro p{
        margin-block: 1.5em
    }
    #intro a{
        width: 15em;
        color: #2B4453;
        text-align: center;
        background-color: white;
        border: 3px #2B4453 solid;
        padding-block: 0.75em;
        border-radius: 2em;
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: bold;
        letter-spacing: 3px;
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
        background:linear-gradient(to top, #101719, #202D31);
        overflow: hidden
    }
    .ww-color-div-0{
        position: absolute;
        top:-10em;
        right:-5em;
        border-radius: 50%;
        width: 40%;
        height: 50%;
        background-color:#49666F;
        filter:blur(150px)
    }
    .ww-color-div-1{
        position: absolute;
        bottom:-12em;
        right:0;
        border-radius: 30em;
        width: 80%;
        height: 100%;
        background-color:#101719;
        filter:blur(150px)
    }
    .ww-color-div-2{
        position: absolute;
        top:-15em;
        right:10em;
        border-radius: 30em;
        width: 50%;
        height: 60%;
        background-color:#405B63;
        filter:blur(150px)
    }
    .ww-color-div-3{
        position: absolute;
        bottom:0;
        left:0;
        border-radius: 50%;
        width: 40%;
        height: 50%;
        background-color:#2B4453;
        filter:blur(150px)
    }

    .wisdomWordsSection h1{
        font-size: clamp(4rem, 8.5vw, 6.5rem);
        color: #fff;
    }
    .arrows{
        display: flex;
        justify-content: flex-end;   
    }
    .wisdomWordsExamplesContainer{
        padding-top: 3em;
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
    .functionExampleSection.img-left{
        flex-direction: row-reverse;
    }
    .functionExampleSection:hover{
        height: 70vh
    }
    .functionExampleSection span{
        font: inherit;
        display: inline-block
    }
    .functionExampleSection h2{
        padding-right: 1em
    }
    .functionExampleSection.img-left h2{
        padding-right: 0;
        padding-left: 1em;
        text-align: right
    }
    .img-container{
        width:50%;
        height:80%;
        border-radius: 100em;
        display: flex;
        justify-content: center;
        align-items: baseline;
        overflow: hidden;

        background: linear-gradient(to bottom, #202D31, #779ba6);
        transition: all 0.35s;
    }
    .img-container .color-div-1{
        position: absolute;
        bottom:-12em;
        left:10;
        border-radius: 50%;
        width: 90%;
        height: 150%;
        background-color:#b5c9cf;
        filter:blur(50px)
    }
    .img-container .color-div-2{
        position: absolute;
        top:-5em;
        left:-3em;
        border-radius: 50%;
        width: 20em;
        height: 20em;
        background-color:#101719;
        filter:blur(100px)
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
        transform: skewX(45deg) translateX(50em);
        transition: 0.5s;
        z-index: 1
    }
    .img-container:hover::before{
        transform: skewX(45deg) translateX(-20em)
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
        background-color: #202d318a;
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
        }
        .wisdomWordsSection{
            padding: 7em 3em
        }
        .functionExampleSection{
            margin: 0 3em;
            padding: 0
        }
        .functionExampleSection .color-div-1 {
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
            line-height: 3rem;
        }
        .wisdomWordsExamplesContainer {
            grid-auto-columns: 55%;
        }

        .functionExampleSection{
            height: auto;
            flex-direction: column-reverse !important;
            margin: 0;
            margin: 2em 3em
        }
        .functionExampleSection:hover{
            height: auto;
        }
        .functionExampleSection h2{
            font-size: 2.6rem;
            align-self: flex-start;
            margin-top: 0.5em;
            padding:0 !important
        }
        .img-container{
            width:100%;
            height: 35vh
        }
        .img-container:hover{
            height: 45vh
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
            gap: 4%;
        }
        .wisdomWordsSection{
            padding: 7em 2em
        }
        .functionExampleSection{
            margin: 2em 2em;
        }
        .functionExampleSection h2{
            text-align: left !important
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
        #parent{
            margin-bottom: 18vh
        }
        .wisdomWordsSection{
            padding: 7em 1em
        }
        .wisdomWordsSection h1{
            font-size: 3.5rem
        }
        .functionExampleSection{
            margin-inline: 1em
        }
        .functionExampleSection:hover{
            height: 50vh;
        }
        .questionsSection h3{
            margin-top: 1.25em;
        }
        #scroll-top{
            height: 10em
        }
        footer span{
            display: block
        }
    }
</style>
