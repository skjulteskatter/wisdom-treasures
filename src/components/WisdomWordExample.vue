<template>
    <div class="wisdomWordExample">
        <p class="wisdom-content">{{ content }}</p>
        <div class="wisdom-author">
            <img class="author-img" :src="imgSrc" />
            <p class="author-title">{{ author }}</p>
        </div>
        
     </div>
</template>

<script lang="ts">
 import { defineComponent } from "vue"

 export default defineComponent({
    name: "wisdom-word-example",
    props: ['content', 'author', 'imgSrc'],

 })
</script>

<style>

/* wisdom Words display */
    .wisdomWordExample{
        height: 18em;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-top: var(--accent-clr) solid 1.75px;
        border-right: var(--accent-clr) solid 1.75px;
        border-top-right-radius: 1.75em;
        padding: 2em 2em 2em 0;
        z-index: 99
    }
    .wisdom-content{
        margin-bottom: 0.5em;
        font-size: 1.2rem;
        font-family: 'EB Garamond', serif;
    }
    .wisdom-author{
        display: flex;
        align-items: center;
    }
    .author-title{
        font-size: .8rem;
    }
    .author-img {
        height: 5em;
        width: 5em;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 1.5em
    }
    @media only screen and (max-width: 1024px){
        .wisdom-content{
            font-size: 1.25rem
        }
    } 
    @media only screen and (max-width: 810px){
        .wisdom-content{
            font-size: 1.1rem
        }
        .author-img {
            height: 4em;
            width: 4em;
            margin-right: 1.25em
        }
    }

</style>