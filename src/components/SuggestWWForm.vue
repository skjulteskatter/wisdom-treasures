<template>
  <div class="scroll-top" :class="{ active: isThemeDrawerActive, moveLeft: isHovered}">
    <div class="drawer-button" :class="{ active: isThemeDrawerActive, hover: isHovered}" @click="toggleForm"
      @mousedown="handleMouseDown" @mouseover="handleMouseOver" @mouseout="handleMouseOut">
      <img class="profile-img" src="/img/logo.svg" style="height: 35px; width: 35px" alt="Profile Image" />
    </div>

    <!-- <div v-if="isFormOpen" @click="closeForm" class="form-overlay h-screen"> -->
      <BaseModal :show="isFormOpen" @click=closeForm class="fixed w-full h-full left-0 top-0 z-40" @close="(e: any) => {$emit('close', e)}" :useBaseCard="false">
      <template #default >
        <div class="form-card">
        <span class="close-icon" @click="closeForm">&#10005;</span>
        <div class="form-title">Suggest a Wisdom Word</div>
        <form @click.stop @submit.prevent="submitForm" method="POST"
          :action=appScriptsLink>
          <div class="form-field">
            <label class="label" for="wisdom-word">{{ $t('form.what')}}</label>
            <input name="WisdomWord" required type="text" id="wisdom-word" v-model="formData.wisdomWord"  />
          </div>
          <div class="form-field">
            <label class="label" for="author">{{ $t('form.who')}}</label>
            <input name=Author required type="text" id="author" v-model="formData.author"  />
          </div>
          <div class="form-field">
            <label class="label" for="date">{{ $t('form.when')}}</label>
            <input name=Time required type="text" id="date" v-model="formData.date"  />
          </div>
          <div class="form-field">
            <label class="label" for="context">{{ $t('form.context')}}</label>
            <input Name="Source" required type="text" id="context" v-model="formData.context"  />
          </div>
            <div class="form-field">
              <label class="label" for="Email">{{ $t('form.email')}}</label>
              <input name="Email" required type="email" id="email" v-model="formData.email" />
            </div>
            <div class="form-field">
              <label class="label" for="namesender">{{ $t('form.name')}}</label>
              <input name="NameSender" required type="text" id="namesender" v-model="formData.nameSender" />
            </div>
          <button class="submit-button" type="submit">{{ $t('form.submit')}}</button>
          <div v-if="isSubmitted" class="success-message">
            {{ $t('form.success')}}
          </div>
        </form>
      </div>
    </template>
    </BaseModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "../components/BaseModal.vue"
export default {
  name: "form-suggestion",
  data() {
    return {
      isThemeDrawerActive: false,
      isScrolling: false,
      isHovered: false,
      isFormOpen: false,
      isSubmitted: false,
      appScriptsLink: import.meta.env.VITE_APP_SCRIPTS_SUGGESTION_LINK,
      formData: {
        email: '',
        wisdomWord: '',
        author: '',
        date: '',
        context: '',
        nameSender: ''
      },
    };
  },
  components:{
    BaseModal
  },
  methods: {
    handleOutsideClick(event: MouseEvent) {
      if (!(this.$refs.formCard as HTMLElement).contains(event.target as Node)) {
        this.closeForm();
      }
    },

    toggleForm() {
      console.log('appScriptsLink', this.appScriptsLink)
      this.isFormOpen = !this.isFormOpen;
      console.log(this.isFormOpen)
    },
    closeForm() {
      this.isFormOpen = false;
      this.isSubmitted = false;
    },
    submitForm(event: Event) {
      event.preventDefault(); // Prevent the default form submission

      // Perform any additional processing or validation here

      // Submit the form data using AJAX or fetch
      // Here's an example using fetch:
      const form = event.target as HTMLFormElement; // Assert the type of event.target to HTMLFormElement
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
      })
        .then(response => {
          console.log(response)
          // Handle form submission logic here
          this.isSubmitted = true;
          setTimeout(() => {
            this.closeForm();
          }, 10000);
          this.formData = {
            email: '',
            wisdomWord: '',
            author: '',
            date: '',
            context: '',
            nameSender: ''
          };
        })
        .catch(error => {
          console.log(error)

          // Handle any errors
          console.error('Error submitting form:', error);
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.scroll-top {
  .drawer-button {
    position: fixed;
    bottom: 100px;
    right: -20px;
    background-color: #fdfdfd;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    // box-shadow: 1px 1px 9px #dedede;
    --tw-shadow: -10px 5px 40px -12px rgba(0, 0, 0, 0.322);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    transition: all 0.5s;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 40;

    &.moveLeft {
      right: 20px;
    }

    &.hover {
      transform: scale(1.1);
    }

    img.profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .hover-text {
      font-size: 12px;
    }
  }

  .form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 10px
  }

}

.form-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 25rem;
  max-width: 100%;
  max-height: 90vh;
  margin: 0 auto;
  padding: 1.25rem;
  padding-top: 2.5rem;
  position: relative;
  overflow-y: auto
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.label {
  font-size: 12px;
}

.form-field {
  margin-bottom: 16px;
}

.form-field label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

.form-field input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 12px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #3D6E7C;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}

.success-message {
  margin-top: 16px;
  font-size: 12px;
  color: #555;
}

.close-icon {
  position: absolute;
  top: 6px;
  right: 12px;
  font-size: 24px;
  cursor: pointer;
}
</style>