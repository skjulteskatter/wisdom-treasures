<template>
    <div
        class="loader"
        v-if="loading">
        <strong>Loading</strong>
    </div>
    <slot v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "loader-component",
    props: {
        loading: {
            type: Boolean,
            default: false,
        }
    },
});
</script>

<style lang="scss" scoped>
.loader {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    z-index: 9;

    &:before {
        --size: 1.5rem;
        --thickness: .3rem;
        content: "";
        width: var(--size);
        height: var(--size);

        border-radius: 100%;
        border-bottom: var(--thickness) solid var(--wt-color-primary);
        border-top: var(--thickness) solid var(--wt-color-primary);
        border-left: var(--thickness) solid var(--wt-color-primary);
        border-right: var(--thickness) solid rgba(white, .1);

        animation: loading .7s infinite linear;
    }

    &--global {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    &__text {
        margin-top: 1rem;
    }
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
