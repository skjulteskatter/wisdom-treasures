<template>
    <div class="scroll-top" :class="{ active: isThemeDrawerActive, moveRight: isScrolling }">
        <div class="drawer-button" :class="{ active: isThemeDrawerActive }" @click="toggleDrawer"
            @mousedown="handleMouseDown">
            <img class="profile-img" src="/img/logo.svg" alt="Profile Image" />
        </div>
    </div>
</template>
<script lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

export default {
    name: 'ScrollTop',
    data() {
    return {
      isScrolling: false,
      isThemeDrawerActive: false,
      scrollTimeout: null as ReturnType<typeof setTimeout> | null,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (this.scrollTimeout !== null) {
        clearTimeout(this.scrollTimeout);
      }

      this.isScrolling = true;

      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
        this.scrollTimeout = null; // Reset to null after handling the timeout
      }, 3000);
    },
    toggleDrawer() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    handleMouseDown() {
      // Add any additional logic for handling the mouse down event if needed
    },
  },
};
</script>
  
<style lang="scss" scoped>
.scroll-top {
    .drawer-button {
        position: fixed;
        bottom: 100px;
        right: -20px;
        background-color: #ffffff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        box-shadow: 1px 1px 9px #dedede;
        transition: all 0.5s;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        transition: all 0.5s;

        &.moveRight {
            right: 20px;
        }

        img.profile-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
    }
}
</style>
  