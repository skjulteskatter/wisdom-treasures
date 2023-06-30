<template>
  <div>
    <p class="text-xxs text-[color:var(--wt-color-text-grey)] opacity-30 text-center py-4 px-5" >
      © 2022 Stiftelsen Skjulte Skatters Forlag. All Rights Reserved
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "FooterComponent",
});
</script>
<style>
.text-xxs{
  font-size: 0.65rem;
}
</style>