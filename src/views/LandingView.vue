<template>
    <body>
        <LandingNavBar />
        <main>
            <div class="intro max-width-cont">
                <!-- wisdom treasures banner -->
                <div>
                    <h1>Wisdom Treasures</h1>
                    <p>A toolbox with over 10 000 wisdom words based on Gods Word that suit your needs. 
                        Everything accessible in one application to help you go victoriously through the day.</p>
                    <button @click="scrollToAbout" class="about-a">About The App</button>
                    <router-link to="/login" class="subscribe-a">Subscribe Now</router-link>
                </div>
                <img src="/images/banner3.png" />
            </div>
            <div class="insight">
                <!-- insight -->
                <div class="insight-inner max-width-cont">
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

                        <router-link to="/login" class="insight-a"> See more</router-link>
                    </div>
                    
                </div>
                <img class="back-intro" src="/images/back-intro.png" />
                
            </div>
            <div class="WW-gallery max-width-cont">
                <!-- WW GALLERY  -->
                <div class="WW-gallery-title">
                    <h2>Wisdom words</h2>
                    <p>Let us give you a taste of what`s to come</p>
                </div>
                <div class="WW-gallery-display">
                    <WisdomWordExample :author="author4" :content="content4" :imgSrc="imgSrc1"/>
                    <WisdomWordExample :author="author2" :content="content2" :imgSrc="imgSrc2"/>
                    <WisdomWordExample :author="author3" :content="content3" :imgSrc="imgSrc3"/>
                    <WisdomWordExample :author="author1" :content="content1" :imgSrc="imgSrc1"/>
                </div>
                <img src="/img/logo.svg" class="watermark"/>
            </div>
            <div class="app-features max-width-cont">
                <!-- app features -->
                <h2>App features</h2>
                <p>Check them out!</p>
                <div class="col-holder">
                    <div class="col">
                        <div class="feature"><img src="/images/app-feat-1.png" class="app-feat-img skewX" /></div>
                        <p>Start every morning with reading today's wisdom word</p>
                        <div class="feature glass-effect"><img src="/images/app-feat-2.png" class="app-feat-img app-feat-img-fill" /></div>
                        <p>Listen to speeches related to a topic of your choice</p>
                    </div>
                    <div class="col col-2">
                        <div class="feature glass-effect"><img src="/images/app-feat-3.png" class="app-feat-img app-feat-img-fill" /></div>
                        <p>Mark words as favourites and view history</p>
                        <div class="feature"><img src="/images/app-feat-4.1.png" class="app-feat-img skewY" /></div>
                        <p class="last-app-feat-p">Browse through topics</p>
                    </div>
                </div>
            </div>
            <div id="about" class="about max-width-cont">
                <!-- about wisdom treasures -->
                <div class="about-inner-cont">
                    <h2>About Wisdom Treasures</h2>
                    <p>Wisdom Treasures is a platform developed by the non-profit foundation Stiftelsen Skjulte Skatters Forlag.
                        Our mission is to share edifying Christian literature and intellectual works with anyone who is interested. 
                        Our goal is to make these wisdom treasures accessible to people of all ages through a modern and effective platform.
                        <br><br>
                        <span>See also <a href="https://activechristianity.org/">activechristianity.org</a></span></p>
                </div>
            </div>
            <div class="ST-add">
                <!-- ST add banner -->
                <div class="ST-add-inner max-width-cont">

                    <div>
                        <h2>Have you already seen <br><span>Song Treasures</span>?</h2>
                        <p>Go to <a href="https://songtreasures.org/">songtreasures.org</a></p>
                        <p>Song Treasures is another product on the Treasures platform. 
                            While Wisdom Treasures provides you with edifying words, 
                            Song Treasures is a collection of spiritual/Christian music, songbooks and 
                            uplifting melodies made available through a user-friendly App for the benefit of all 
                            Christian groups and fellowships.</p>
                    </div>
                    <img src="/images/song-treasures2.png" />
                </div>
                <img class="back-ST-add" src="/images/back-ST-add.png" />
            </div>
            <div class="questions-cont ">
                <!-- QUESTIONS SECTION -->
                <div class="questions max-width-cont">
                    <div class="questions-text">
                        <h2>Do you have any <br> questions?</h2>
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
            <div class="scroll-to-top max-width-cont">
                <div class="scroll-inner-cont">
                    <!-- scroll to the top -->
                    <div class="mobile-form"><img src="/img/logo.svg" class="drop-shadow" /><p class="drop-shadow"><span>wisdom</span>treasures</p></div>
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
            scrollToAbout() {
                const element = document.getElementById('about') as HTMLElement;
                element.scrollIntoView({ behavior: 'smooth' });
            },
        }, data() {
            return {
                author1: 'Johan O. Smith',
                author2: 'Sigurd Bratlie',
                author3: 'Kåre J. Smith',
                author4: 'Johan O. Smith',
                content1: 'Om du griper visdommen, vil du snart være et produkt av dens behandling.',
                content2: 'Det å bli døpt med den Hellige Ånd tar ikke bort selvfornektelsens lidelse. Nei, men det gir deg kraft til å lide i kjødet. ',
                content3: 'De rettferdiges bønner kan flytte Guds hender rundt omkring på jorden.',
                content4: 'Du kan i løpet av fem minutter si så meget ondt, at ikke fem år kan få helbredet det brutte samfund og få oprettet tillitsforholdet.',
                imgSrc1: "images/JOS.webp",
                imgSrc2: "images/SB.webp",
                imgSrc3: "images/KJS.jpg",
            }
        },
});
</script>

<style>
    :root{
        --primary-clr: #3D6E7C;
        --darker-primary: #33606C;
        --lighter-accent: #f1e4cf;
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
        font-size: clamp(2rem, 6vw, 3.5rem); /* what should be the min? */
        font-weight: bold;
        letter-spacing: 1px;
    }
    h2{
        font-size: clamp(2rem, 4vw, 3.5rem);
        font-weight: bold;
        line-height: 4rem;
        margin-bottom: .2em
    }
    h3{
        font-size: 1.5rem;
        font-weight: bold
    }
    p{
        font-size: 1.15rem
    }

    .max-width-cont{
        max-width: 1400px;
        margin-left: auto;
        margin-right: auto
    }
    /* BODY */
    .intro{
        height: 40rem;
        padding-inline: var(--pad-inline);
        margin-block: 1em;
        display: flex;
        align-items: center;
        justify-content: space-between;

        z-index: 1
    }
    .intro h1{
        margin-bottom: .2em;
        margin-right: -1em;
    }
    .intro p{
        width: 85%;
        margin-bottom: 2em;
    }
    .intro a, .intro button{
        display: inline-block;
        padding: .5em 2em;
        border-radius: 4em;
        color: white;
        transition: all .25s;
    }
    .intro .about-a{
        background: var(--primary-clr);
        margin-right: 1em;
    }
    .intro .subscribe-a{
        background: var(--accent-clr)
    }
    .intro a:hover{
        text-decoration: underline;
    }
    .intro img{
        height: 33em;
        margin-top: 4em;
    }
    @media(max-width: 925px){
        .intro{
            flex-direction: column;
            margin-block: 20vh;
            text-align: center;
        }
        .intro h1{
            margin-right: 0
        }
        .intro p{
            width: 100%;
        }
    }
    @media(max-width:400px){
        .intro a, .intro button{
            display:block;
            width:100%
        }
        .intro .about-a{
            margin: 1em 0
        }
    }


    .insight{
        padding-block: var(--pad-block);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .insight-inner{
        display: flex;
        justify-content: center;
        align-items: center;
        width:100%;
        padding-inline: var(--pad-inline)
    }
    .insight-cont{
        width: 100%;
        padding: 3em;
        border-radius: 1em;
        background-color: white;
        box-shadow: 0 0 25px #00000031;
        z-index: 1;
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
    .back-intro{
        height: 170%;
        position: absolute;
        bottom: 0;
        right:0;
    }
    @media(min-width: 1700px){
        .back-intro{height: 220%;}
    }
    @media(max-width:600px){
        .insight-cont{
            padding:2em
        }
    }

    .WW-gallery{
        display: flex;
        width:100%;
        justify-content: space-between;
        padding-top: var(--pad-block);
        padding-bottom: calc(2*var(--pad-block));
        padding-inline: var(--pad-inline);
        border-top: solid var(--light-grey) 1px;
    }
    .WW-gallery-display{
        width: 48%
    }
    .WW-gallery-title{
        margin-bottom: 2em
    }
    .watermark{
        height: 50em;
        position: absolute;
        bottom:0;
        left:-14em;
        opacity: .5;
    }

    @media(max-width:600px){
        .WW-gallery{
            flex-direction: column;
            padding-bottom: 0;
        }
        .WW-gallery-display{
            width:100%
        }
        .watermark{
            bottom:-30em;
            left:-20em;
            opacity:.4
        }
    }
    @media(max-width:400px){
        .watermark{
            bottom:-30em;
            left:-14.5em;
            opacity:.4
        }
    }

    .app-features{
        padding-inline: var(--pad-inline);
        padding-top: calc(2*var(--pad-block));
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
        width:100%;
        aspect-ratio: 1/1.25;
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
    @media(max-width:600px){
        .app-features{
            padding-top: var(--pad-block);
        }
        .col-holder{
            flex-direction:column;
            justify-content:center
        }
        .col{
            width:100%
        }
        .col-2{
            padding-top:0em;
        }
        .col-holder p{
            padding-block: 2em
        }
        p.last-app-feat-p{
            padding-bottom:0;
        }
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
        align-items: center;
        padding-inline:var(--pad-inline);
        border-top: solid 1px var(--lighter-accent);
    }
    .about-inner-cont{
        display: flex;
    }
    .about-inner-cont a{
        text-decoration: underline;
        color: var(--darker-accent)
    }
    .about h2{
        width: 50%
    }
    .about p{
        width: 50%
    }
    @media(max-width:600px){
        .about{
            height:auto;
            padding-block: var(--pad-block)
        }
        .about-inner-cont{
            flex-direction: column;
        }
        .about h2{
            width: 100%
        }
        .about p{
            width: 100%
        }
    }

/* 
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
 */

    .ST-add{
        height: 100vh;
        display:flex;
        align-items: center;
        justify-content: center;
        border-top: solid 1px var(--light-grey);
        background-color: var(--very-light-grey);
    }
    .ST-add-inner{
        display:flex;
        align-items: center;
        justify-content: space-between;
        height:100%;
        width:100%;
        padding-inline: var(--pad-inline);
        z-index: 99;
    }
    .ST-add span{
        font-weight: bold;
        color: var(--accent-clr)
    }
    .ST-add p{
        margin-top:1em;
        width: 80%;
        z-index: 1
    }
    .ST-add a{
        text-decoration: underline;
        color: var(--darker-accent)
    }
    .ST-add img{
        width: 50%;
        max-height: 80%;
        z-index: 1
    }
    .ST-add .back-ST-add{
        height: 100%;
        max-height:100%;
        position:absolute;
        bottom:0;
        right:0;
        z-index: 0
    }
    @media(max-width:750px){
        .ST-add{
            height:auto;
            padding-block: var(--pad-block)
        }
        .ST-add-inner{
            flex-direction: column;
        }
        .ST-add p{
            width:100%
        }
        .ST-add img{
            width:80%;
            margin-top:3em
        }
    }



    .questions-cont{
        height: 100vh;
        display:flex;
        align-items: center;
        background-color: var(--light-blue)
    }
    .questions{
        width:100%;
        display: flex;
        justify-content: space-between;
        padding-inline: var(--pad-inline);
    }
    .questions form{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .questions input, textarea{
        width: 40vw;
        height: 3em;
        margin-left: 3em;
        background: none;
        border: none;
        border-bottom: 2px solid var(--primary-clr);

        transition: all .25s
    }
    .questions input:hover, .questions textarea:hover{
        transform: scale(1.05)
    }

    .questions textarea{
        height: 6em
    }
    .questions button {
        align-self: flex-end;
        margin-top: 1em;
        padding: .5em 2.5em;
        border-radius: 3em;
        background-color: var(--accent-clr);
        color: white
    }
    @media(max-width:600px){
        .questions{
            flex-direction: column
        }
        .questions input, textarea{
            width:100%;
            margin-left: 0;
        }
        .questions form{
            margin-block:2em;
        }
    }


    .scroll-to-top{
        display: flex;
        justify-content: center;
        margin-bottom: var(--pad-block)
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
    @media(max-width:600px){
        .mobile-form{
            margin-top: -3em;
        }
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


    /* SCROLLBAR */
    ::-webkit-scrollbar{
        width: 1em;
        height: 1em
    }
    /* ::-webkit-scrollbar-track{
        background: none;

    } */
    ::-webkit-scrollbar-thumb{
        background: linear-gradient(var(--darker-primary), var(--primary-clr));
        border: solid 3px #ffffff;
        border-radius: .35em;
    }
    ::-webkit-scrollbar-thumb:hover{
        background: var(--darker-primary);
    }


</style>
