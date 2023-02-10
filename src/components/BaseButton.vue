<template>
    <button
        class="overflow-hidden z-10 text-white select-none cursor-pointer flex items-center gap-2 rounded-md relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 active:text-opacity-50"
        :class="[`button--${theme} button`, { 'opacity-75 cursor-wait button--loading': loading, 'button--disabled': disabled, 'button--clicked': clicked, 'py-1 px-2': size == 'small', 
            'py-2 px-4': size == 'medium', 'py-3 px-6': size == 'large', 'justify-center' : centerText, 
            'threeDButton opacity-100': threeD }]"
        :disabled="loading || disabled"
        v-bind="$attrs"
    >
        <span v-if="$slots.firstIcon">
            <slot name="firstIcon" />
        </span>
        <span
            :class="{ 'text-sm': size == 'medium', 'text-xs': size == 'small', 'text-base': size == 'large', 'font-semibold': theme == 'menuButton' }"
            v-if="$slots.default"
        >
            <slot />
        </span>
        <span v-if="$slots.icon">
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
                        "magic",
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
        background-color: var(--wt-color-primary);
    }

    &--secondary {
        background-color: var(--wt-color-secondary);
    }

    &--tertiary {
        @apply text-primary hover:bg-primary/20;

        &:hover:after {
            content: "";
            display: none;
        }
    }

    &--menuButton {
        @apply text-[color:var(--color-text)] hover:bg-black/10;

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
        background: linear-gradient(-60deg, var(--wt-color-primary), rgb(255, 67, 255), rgb(63, 169, 255), var(--wt-color-primary), rgb(255, 67, 255), rgb(63, 169, 255), var(--wt-color-primary));
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
    transform: translate3d(-2px, -4px, 1px);
    transition:
      transform
      600ms
      cubic-bezier(.3, .7, .4, 1);
  }

  .threeDButton:hover {
    transform: translate3d(-4px, -8px, 1px);
    transition:
      transform
      250ms
      cubic-bezier(.3, .7, .4, 1.5);
  }

  .threeDButton:active {
    transform: translate3d(-1px, -2px, 1px);
    transition: transform 34ms;
  }

</style>
