import { createApp } from 'vue';
import { createPinia } from 'pinia';

import i18n from './i18n';
import 'tailwindcss/tailwind.css';
import './style/tailwind.css';
import './style/main.scss';
import 'vue-plyr/dist/vue-plyr.css';
import {version} from '../package.json'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

import VuePlyr from 'vue-plyr';

//GLOBAL COMPONENTS
import LoaderComponent from './components/Loader.vue';

import App from './App.vue';
import router from './router';

import './assets/main.css';
// import '@fortawesome/fontawesome-free/css/all.css';

import { registerSW } from 'virtual:pwa-register' //Don't know if this does anything
registerSW({ immediate: true });

console.log("Running version: " + version);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VuePlyr, {
    plyr: {}
});
app.component("LoaderComponent", LoaderComponent)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app');
