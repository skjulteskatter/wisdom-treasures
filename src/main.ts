import { createApp } from 'vue';
import { createPinia } from 'pinia';
import i18n from './i18n';
import './style/main.scss';
import './style/tailwind.css';

//GLOBAL COMPONENTS
import LoaderComponent from './components/Loader.vue';

import App from './App.vue';
import router from './router';

import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.component("LoaderComponent", LoaderComponent)

app.mount('#app');
