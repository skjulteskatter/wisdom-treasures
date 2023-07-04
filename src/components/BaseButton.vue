<template>
    <button
        class="overflow-hidden z-10 text-primary select-none cursor-pointer flex items-center gap-2 rounded-md relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 active:text-opacity-50"
        :class="[`button--${theme} button`, { 'opacity-75 cursor-wait button--loading': loading, 'button--disabled': disabled, 'button--clicked': clicked, 'py-1 px-2': size == 'small', 
            'py-2 px-4': size == 'medium', 'py-3 px-6': size == 'large', 'justify-center' : centerText, 
            'threeDButton opacity-100': threeD, 'threeDButtonAnimation' : threeD && !loading, 'bg-white/40' : whiteText, 'rounded-l-none gap-0 border-none bg-black/10 sm:bg-black/10' : forMultiSearch }]"
        :disabled="loading || disabled"
        v-bind="$attrs"
    >
        <span v-if="$slots.firstIcon">
            <slot name="firstIcon" />
        </span>
        <span
            :class="{ 'text-sm': size == 'medium', 'text-xs': size == 'small', 'text-base': size == 'large', 'font-semibold': theme == 'menuButton' ||'wisdomMannaBtn' }"
            v-if="$slots.default"
        >
            <slot />
        </span>
        <span v-if="$slots.icon" :class="[whiteText ? 'text-white/60 sm:text-inherit sm:opacity-40' : '', forMultiSearch ? 'opacity-40' : '']">
            <slot name="icon" />
        </span>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "base-button",
    props: {
        theme: {
            type: String,
            default: "primary",
            validator: (value: string) => {
                return (
                    [
                        "primary",
                        "secondary",
                        "tertiary",
                        "success",
                        "error",
                        "warning",
                        "neutral",
                        "menuButton",
                        "menuButtonSMWhite",
                        "magic",
                        "noBg",
                        "filterXBtn"
                    ].includes(value)
                );
            },
        },
        loading: {
            type: Boolean,
            default: false,
        },
        loadingLabel: {
            type: String,
            default: "Loading...",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "medium",
            validator: (v: string) => ["small", "medium", "large"].includes(v),
        },
        clicked: { //This is just for styling purposes
            type: Boolean,
            default: false,
        },
        centerText: { //This is just for styling purposes
            type: Boolean,
            default: true,
        },
        threeD: { //This is just for styling purposes
            type: Boolean,
            default: false,
        },
        forMultiSearch:{
            type: Boolean,
            default: false
        },
        whiteText:{
            type: Boolean,
            default: false
        }
    },
    computed: {
        isLoading() {
            return this.loading;
        },
        currentRouteName() {
            return this.$route.name;
        }
    },
});
</script>

<style lang="scss" scoped>
.button {
    &:hover {
        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(white, 0.1);
            z-index: 1;
        }
    }

    &--primary {
        border: 1.5px solid var(--wt-color-primary);
        background-color: rgba(255, 255, 255, 0.1);
    }
    &--mini {
        background-color: #85A4AC;
    }
    &--secondary {
        background-color: var(--wt-color-secondary);
    }
    &--primarylight {
        background-color: #85A3AC;
    }
    &--threeDBtn{
        @apply bg-primary text-white rounded-lg tracking-wide
    }
    &--tertiary {
        @apply text-primary hover:bg-primary/20;

        &:hover:after {
            content: "";
            display: none;
        }
    }
    &--noBackground {
        @apply bg-transparent text-primary
    }

    &--menuButton {
        @apply text-[color:var(--color-text)] tracking-wide py-3 hover:bg-black/10;

        &:hover:after {
            content: "";
            display: none;
        }
    }
    &--wisdomMannaBtn {
        @apply text-white sm:text-[color:var(--color-text)] tracking-wide py-3 hover:bg-black/10;

        &:hover:after {
            content: "";
            display: none;
        }
    }
    &--filterXBtn{
        @apply text-inherit tracking-wide py-1 hover:bg-black/10;
    }
    &--noBg {
        @apply bg-transparent text-[color:var(--color-text)] opacity-80 border-b border-black/20 rounded-none py-2 pb-4 px-4;
    }
    &--menuButtonSMWhite{
        @apply text-white tracking-wide py-3;

        @screen sm {
            @apply text-[color:var(--color-text)]
        }

        &:hover:after {
            content: "";
            display: none;
        }
    }
    &--menuButtonSMDark{
        @apply text-[color:var(--wt-color-text-grey)] tracking-wide py-3 font-bold;

        @screen sm {
            @apply text-[color:var(--color-text)] font-bold;
        }

        &:hover:after {
            content: "";
            display: none;
        }
    }

    &--magic {
        @apply text-white;

        &:hover:after {
            content: "";
            display: none;
        }
        &:hover{
            box-shadow: 
                0 0 15px 3px var(--wt-color-primary),
                inset 0 0 7px 0.5px rgba(255, 255, 255, 0.63),
                inset 0 0 2px 1px rgba(255, 255, 255, 0.801);
        }
        background: linear-gradient(-60deg, var(--wt-color-primary), #4f8c9c, #284b53, var(--wt-color-primary),#5f9faf, #285a66, var(--wt-color-primary));
        animation: gradientAnimated 20s ease infinite;
        background-size: 700% 700%;
    }

    &--warning {
        background-color: var(--wt-color-warning);
    }

    &--success {
        background-color: var(--wt-color-success);
    }

    &--error {
        background-color: var(--wt-color-error);
    }

    &--neutral {
        @apply bg-black/10 text-gray-800;
    }

    &--loading {
        &:before {
            content: "";
            background-color: rgba(white, 0.5);

            height: 5px;
            width: 25%;
            border-radius: 1em;

            position: absolute;
            bottom: 0;
            left: -20%;

            animation: buttonLoad 1s linear infinite;
        }
    }

    &--disabled {
        @apply cursor-not-allowed bg-black/10 text-gray-400;

        &:hover:after {
            content: "";
            display: none;
        }
    }

    &--clicked {
        @apply text-primary;
    }
}

@keyframes buttonLoad {
    to {
        transform: translateX(500%);
    }
}

@keyframes gradientAnimated {
	0% {
		background-position: 0% 50%;
	}
	25% {
		background-position: 100% 50%;
	}
	50% {
		background-position: 0% 50%;
	}
    75% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

.threeDButton {
    transform: translate3d(-0px, -4px, 1px);
    transition:
      transform
      600ms
      cubic-bezier(.3, .7, .4, 1);
  }

  .threeDButtonAnimation:hover {
    transform: translate3d(-0px, -8px, 1px);
    transition:
      transform
      250ms
      cubic-bezier(.3, .7, .4, 1.5);
  }

  .threeDButtonAnimation:active {
    transform: translate3d(-0px, -2px, 1px);
    transition: transform 34ms;
  }

</style>
