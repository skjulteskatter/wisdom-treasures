<template>
    <body>
        <LandingNavBar/>
        <main>
            <div class="intro">
                <!-- wisdom treasures banner -->
                <div>
                <h1>Wisdom Treasures</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vestibulum molestie tortor ipsum, vitae suscipit ex varius eget. 
                    Sed sodales consequat ligula, vel fringilla mauris.</p>
                <router-link to="/login" class="login-a">Subscribe Now</router-link>
                </div>
                <img src="/images/banner.png" />
            </div>
            <div class="insight">
                <!-- insight -->
                <div class="insight-cont">
                    <h3>Insight</h3>

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
            <div class="WW-gallery">
                <!-- WW GALLERY  -->
                <div>
                    <h2>Wisdom words</h2>
                    <p>Examples</p>
                </div>
                <div class="WW-gallery-display">
                    <WisdomWordExample :author="author4" :content="content4" :imgSrc="imgSrc1"/>
                    <WisdomWordExample :author="author2" :content="content2" :imgSrc="imgSrc2"/>
                    <WisdomWordExample :author="author3" :content="content3" :imgSrc="imgSrc3"/>
                    <WisdomWordExample :author="author1" :content="content1" :imgSrc="imgSrc1"/>
                </div>
                <img src="/img/logo.svg" class="watermark"/>
            </div>
            <div class="app-features">
                <!-- app features -->
                <h2>App features</h2>
                <p>Check them out!</p>
                <div class="col-holder">
                    <div class="col">
                        <div class="feature"><img src="/images/app-feat-1.png" class="app-feat-img skewX" /></div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                        <div class="feature glass-effect"><img src="/images/app-feat-2.png" class="app-feat-img app-feat-img-fill" /></div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                    </div>
                    <div class="col col-2">
                        <div class="feature glass-effect"><img src="/images/app-feat-3.png" class="app-feat-img app-feat-img-fill" /></div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                        <div class="feature"><img src="/images/app-feat-4.png" class="app-feat-img skewY" /></div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                    </div>
                </div>
            </div>
            <div class="about">
                <!-- about wisdom treasures -->
                <h2>About Wisdom Treasures</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vestibulum molestie tortor ipsum, vitae suscipit ex varius eget. 
                    Sed sodales consequat ligula, vel fringilla mauris. 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vestibulum molestie tortor ipsum, vitae suscipit ex varius eget. 
                    Sed sodales consequat ligula, vel fringilla mauris.</p>
            </div>
            <div class="anim-section">
                <!-- animation -->
                <div class="animation">
                    <img src="/images/app-feat-2.png" />
                </div>
            </div>
            <div class="ST-add">
                <!-- add about ST -->
                <div>
                    <h2>Have you already seen <br><span>Song Treasures</span>?</h2>
                    <p>Go to <a href="https://songtreasures.org/">songtreasures.org</a></p>
                </div>
                <img src="/images/song-treasures.png" />
            </div>
            <div class="questions-cont">
                <div class="questions">
                <!-- QUESTIONS SECTION -->
                    <div class="questions-text">
                        <h2>Have questions?</h2>
                        <p>Write to us!</p>
                    </div>
                    <form>
                        <input type="text" placeholder="name">
                        <input type="email" placeholder="e-mail">
                        <textarea placeholder="type your message here"></textarea>
                        <button>submit</button>
                    </form>
                </div>
            </div>
            <div class="scroll-to-top">
                <div class="scroll-inner-cont">
                    <!-- scroll to the top -->
                    <div class="mobile-form"><img src="/img/logo.svg" /><p><span>wisdom</span>treasures</p></div>
                    <button @click="scrollToTop">Scroll to the top</button>
                </div>
            </div>

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
                // startX: 0,
                // startY: 0,
                // isDown: false as boolean,
                // divScrollLeft: 0,
            }
        },
});
</script>

<style>
    :root{
        --primary-clr: #3D6E7C;
        --accent-clr: #BB9758;
        --light-grey: #F2F2F2;
        --light-blue: #EAF3F5;

        --pad-block: 4em;
        --pad-inline: 7em;
    }
    html{
        margin: 0}
    body{
        margin: 0;
        background-color: white;
    }
    /* TYPOGRAPHY */
    h1{
        font-size: clamp(1rem, 6vw, 3.5rem); /* nie wiem jaka jest najmniejsza wartosć */
        font-weight: bold
    }
    h2{
        font-size: 4vw;
        font-weight: bold
    }
    h3{
        font-size: 1.5rem;
        font-weight: bold
    }
    p{
        font-size: 1.15rem
    }


    /* BODY */
    .intro{
        height: 100vh;
        padding-inline: var(--pad-inline);
        margin-block: 1em;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .intro h1{
        margin-bottom: .2em;
        margin-right: -2em;
        z-index: 1
    }
    .intro p{
        width: 90%;
        margin-bottom: 2em;
    }
    .intro a{
        padding: .8em 2em;
        border-radius: 4em;
        /* font-weight: bold; */
        background: var(--primary-clr);
        color: white
    }
    .intro img{
        height: 40em;
        margin-top: 5em
    }

    .insight{
        padding-inline: var(--pad-inline);
        margin-block: var(--pad-block);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .insight-cont{
        width: 100%;
        padding: 3em;
        border-radius: 1em;
        box-shadow: 0 0 20px #e2e2e2;
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
        padding: .7em 2em;
        border-radius: 4em;
        background-color: var(--accent-clr);
        color: white
    }


    .WW-gallery{
        display: flex;
        justify-content: space-between;
        padding-top: var(--pad-block);
        padding-bottom: calc(2*var(--pad-block));
        padding-inline: var(--pad-inline)
    }
    .WW-gallery-display{
        width: 50%
    }
    .watermark{
        height: 50em;
        position: absolute;
        bottom:0;
        left:-14em;
        opacity: .5;

    }



    .app-features{
        padding-inline: var(--pad-inline);
        padding-top: calc(2*var(--pad-block))
    }
    .col-holder{
        display: flex;
        justify-content: space-between;
        padding-block:var(--pad-block)
    }
    .col{
        width:47%;
        text-align: center;
    }
    .col-2{
        padding-top:15em;
    }
    .feature{
        height: 35em;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border-radius: 2em;
        box-shadow: 0 0 25px #cacaca;
    }
    .app-feat-img{
        height:80%;
    }
    .app-feat-img-fill{
        height: 100%;
        object-fit: cover;
    }
    .col-holder p{
        padding-block: 3em
    }

    /* EFFECTS */
    .skewX{
        transition: all 0.5s;
    }
    .skewX:hover{
        transform: skewX(3deg) translateY(-1em)
    }
    .skewY{
        transition: all 0.5s;
    }
    .skewY:hover{
        transform: skewX(-3deg) translateY(-1em)
    }
    .glass-effect::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100%;
        background: rgba(255, 255, 255, 0.24);
        transform: skewX(45deg) translateX(60em);
        transition: 0.4s;
        z-index: 1
    }
    .glass-effect:hover::before{
        transform: skewX(45deg) translateX(-40em)
    }
    /*  */

    .about{ 
        height: 100vh;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-inline:var(--pad-inline);

        background-color: var(--light-blue)
    }
    .about h2{
        width: 50%
    }
    .about p{
        width: 50%
    }


    .anim-section{
        height: 100vh;
        padding-block: var(--pad-block);
        padding-inline: var(--pad-inline);
        display:flex;
        align-items: center
    }
    .animation{
        width: 100%;
        height: 100%;
        background-color: var(--light-grey);
        overflow:hidden
    }
    .animation img{
        width: 100%;
        object-fit: cover;
        position: absolute;
        top:-15em;
    }


    .ST-add{
        height: 100vh;
        padding-inline: var(--pad-inline);
        margin-block: var(--pad-block);
        display:flex;
        align-items: center;
        justify-content: space-between;

    }
    .ST-add span{
        font-weight: bold;
        color: var(--accent-clr)
    }
    .ST-add p{
        margin-top:1em;
        font-weight: bold
    }
    .ST-add a{
        text-decoration: underline;
    }
    .ST-add img{
        height: 100%
    }



    .questions-cont{
        height: 100vh;
        display:flex;
        align-items: center;
        padding-inline: var(--pad-inline);
        background-color: var(--light-blue)
    }
    .questions{
        width:100%;
        display: flex;
        justify-content: space-between;
    }
    .questions form{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .questions input, textarea{
        width: 40vw;
        height: 3em;
        background: none;
        border: none;
        border-bottom: 2px solid var(--primary-clr);
    }
    .questions textarea{
        height: 6em
    }
    .questions button {
        align-self: flex-end;
    }


    .scroll-to-top{
        display: flex;
        justify-content: center;
    }
    .scroll-inner-cont{
        text-align: center
    }
    .mobile-form{
        height: 80vh;
        aspect-ratio: 1 / 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: -5em;
        border: var(--primary-clr) solid 5px;
        border-radius: 2em
    }
    .mobile-form img{
        height: 18%
    }
    .mobile-form p{
        margin-top: 1em;
        font-weight: bold;
        line-height: 1.5rem;
        text-transform: uppercase
    }
    .mobile-form span{
        display:block;
        font-weight: inherit;
        color: var(--primary-clr)
    }
    .scroll-to-top button{
        margin-block: 1em;
        font-size: 1.2rem;
        color: var(--accent-clr);
        text-decoration: underline;
    }




/* TYPING ANIMATION */
    /* :root {
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
    } */

/* 
    SCROLLBAR
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
 */

</style>
