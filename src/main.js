// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import OpenLayersMap from "vue3-openlayers";
import PrimeVue from 'primevue/config';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import './assets/ol-main.css';
import Nora from '@primevue/themes/nora';

import Tooltip from 'primevue/tooltip';
import BadgeDirective from 'primevue/badgedirective';

const app = createApp(App)

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);



app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Nora,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
 });
app.use(OpenLayersMap /* options */);

app.mount('#app')
