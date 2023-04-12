<template>
  <body class="contact">
    <LandingNavBar />
    <div class="contact-container">
      <div class="inner-contact-container">
      <div>
          <h1>Let's get in touch</h1>
          <p>If you'd like to talk to us, need more information or have some suggestions, don't hesitate to write.</p>
        <div class="deco-line line-1"></div>
        <div class="deco-line line-2"></div>
      </div>
      <form class="contact-form">
          <input type="text" placeholder="name">
          <input type="email" placeholder="e-mail">
          <textarea placeholder="type your message here"></textarea>
          <button>submit</button>
      </form>
      </div>
      <img src="/img/logo.svg" class="watermark-contact"/>
    </div>
    <LandingFooter class="contact-footer"/>
  </body>
</template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import LandingNavBar from '@/components/LandingNavBar.vue';
  import LandingFooter from '@/components/LandingFooter.vue';


    export default defineComponent({
      name: "ContactView",
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
html{
    margin: 0}
body{
    margin: 0;
    background-color: white;
}
h1{
    font-size: clamp(1rem, 6vw, 3.5rem); /* nie wiem jaka jest najmniejsza wartosć */
    font-weight: bold;
    letter-spacing: 1px;
}
h2{
    font-size: 4vw;
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


.contact-container{
  height: 95vh;
  padding-inline: var(--pad-inline);
  display: flex;
  align-items: center;
  overflow:hidden
}
.inner-contact-container{
  display: flex;
  justify-content: space-between;
  z-index:99
}
.inner-contact-container p{
  margin-right: 2em
}
.contact-form{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.contact-form input, textarea{
    width: 40vw;
    height: 3em;
    background: none;
    border: none;
    border-bottom: 2px solid var(--primary-clr);
    transition: all .25s
}
.contact-form input:hover, .contact-form textarea:hover{
    transform: scale(1.05)
}
.contact-form textarea{
    height: 6em
}
.contact-form button {
    align-self: flex-end;
}
.deco-line{
  height: 5px;
  width: 20vw;
  background-color: var(--accent-clr);
}
.line-1{
  width: 24vw;
  margin: 2em 0 .75em 1em
}
.contact-form button {
        align-self: flex-end;
        margin-top: 1em;
        padding: .5em 2.5em;
        border-radius: 3em;
        background-color: var(--accent-clr);
        color: white
    }
.watermark-contact{
    height: 50em;
    position: absolute;
    bottom:-22em;
    left:-16em;
    opacity: .35;
}
  </style>