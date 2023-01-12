<template>
    <div class="wisdomWordExample">
        <p class="wisdom-content">{{ content }}</p>
        <p class="wisdom-author">{{ author }}</p>
     </div>
</template>

<script lang="ts">
 import { defineComponent } from "vue"

 export default defineComponent({
    name: "wisdom-word-example",
    props: ['content', 'author']

 })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Montserrat:wght@400;800&display=swap');

/* wisdom Words display */
    .wisdomWordExample{
        border-top: black solid 1.75px;
        border-right: black solid 1.75px;
        border-top-right-radius: 2em;
        width: 20em;
        height: 10em;
        margin-right: 1em;
        padding: 2em 2em 0 0;
    }
    .wisdom-content{
        font-family: 'EB Garamond', serif;
    }
    .wisdom-author{
        font-family: 'EB Garamond', serif;
    }

</style>