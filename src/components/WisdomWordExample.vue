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
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Montserrat:wght@400;800&display=swap');

/* wisdom Words display */
    .wisdomWordExample{
        border-top: #c3c3c3 solid 1.75px;
        border-right: #c3c3c3 solid 1.75px;
        border-top-right-radius: 2em;
        padding: 2em 2em 2em 0;
        font-family: 'EB Garamond', serif;
        display: grid;
        grid-template-rows: min-content;
        gap: 1em;
        width: 100%;
    }
    .wisdom-author{
        display: flex;
        align-items: center;
    }
    .author-title{
        font-size: 1rem;
    }
    .author-img {
        height: 5em;
        width: 5em;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 1.5em
    }

</style>