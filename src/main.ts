import { createApp } from 'vue';
import { createPinia } from 'pinia';
import i18n from './i18n';
import 'tailwindcss/tailwind.css';
import './style/tailwind.css';
import './style/main.scss';
import 'vue-plyr/dist/vue-plyr.css';

import VuePlyr from 'vue-plyr';

//GLOBAL COMPONENTS
import LoaderComponent from './components/Loader.vue';

import App from './App.vue';
import router from './router';

import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VuePlyr, {
    plyr: {}
});
app.component("LoaderComponent", LoaderComponent)

app.mount('#app');
