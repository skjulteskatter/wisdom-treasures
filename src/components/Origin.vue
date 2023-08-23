<template>
    <div class="flex flex-col justify-between items-center text-center cursor-pointer" @click="()=>{$router.push({path: `${originsOrCurrentPath}${origin.id}`})}">
        <div class="w-24 h-24 flex justify-center items-center rounded-xl overflow-hidden hover:bg-black/30 border-2 border-transparent hover:shadow-xl hover:border-solid ">
            <img :src="origin.image || '/img/originPlaceholder.svg'" :alt="origin.name">
        </div>
        <h2 class="mb-5 mt-2 leading-4 font-bold text-sm text-[color:var(--wt-color-text-grey)] opacity-80 tracking-075">
            {{ origin.name }}
        </h2>
    </div>
</template>

<script lang="ts">
import type { Origin } from "@/classes/Origin";
import { defineComponent, type PropType } from "vue"

 export default defineComponent({
    name: "originSquare",
    props: {
        origin: {
            type: Object as PropType<Origin>,
            required: true
        },
    },
    computed: {
        originsOrCurrentPath(){
          let path : string = this.$router.getRoutes().find((x: any) => x.name == "origins")?.path ?? this.$route.path;
          path = path.endsWith("/") ? path : path + "/";
          return path;
        },
    }
 })
</script>@/classes/Origin