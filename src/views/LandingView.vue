<!-- html -->
<template>
  <body>
    <div>
      <input type="text" placeholder="Add an item">
      <button>ADD</button>
    </div>
    <div>
      <ul v-for="item in items" v-bind:key="item.id">
        <li>{{ item.name }}</li>
      </ul>
    </div>
  </body>
</template>
  


<script lang="ts">
import { defineComponent } from 'vue';
  
    export default defineComponent({
      data() {
        return {
          items: [
            { name: 'make the landingview page',
              isCompleted: false,
              id: 1
            },
            { name: 'do the dishes',
              isCompleted: false,
              id: 2
            },
            { name: "test",
              isCompleted: false,
              id: 3
            }
          ]
        }
      },
      methods: {

      },
      watch: {

      },
      computed: {

      }
      });
</script>


<!-- css -->
<style>
button {
  font-weight: bold;
  border: solid black 1px;
  border-radius: 4px;
  padding: 4px;
  margin-top: 1em
}
input{
  border: solid red 3px;
}
</style>