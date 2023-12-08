<script setup>

import ProgressSpinner from 'primevue/progressspinner';
import { ref, onMounted } from 'vue'
import Panel from 'primevue/panel';

const refs = ref({})
const loading = ref(true)

const loadStatus = new Promise (() => {
        fetch(import.meta.env.VUE_APP_APIDEV_ENDPOINT + '/v2.0/data/datasets/12', {
          method:'HEAD', mode:'no-cors'
        })
          .then( (response) => {
            refs.value["apidev"] = response.status === 200;
          })
          .catch(err => console.log(err));

        fetch(import.meta.env.VUE_APP_API_ENDPOINT + '/v2.0/data/datasets/12', {
          method:'HEAD'
        })
          .then( (response) => {
            refs.value["api"] = response.status === 200;
          })
          .catch(err => console.log(err));

        fetch("https://apps.neotomadb.org/explorer",
              { mode: "no-cors", method:'HEAD' })
          .then( (response) => {
            refs.value["explorer"] = response.status === 0;
          })
          .catch(err => console.log(err));

        fetch(import.meta.env.VUE_APP_TILIA_ENDPOINT + '/api',
             {method:"HEAD"})
          .then( (response) => {
            refs.value["tilia"] = response.status === 200;
          })
          .catch(err => console.log(err));
          return null
      })

    onMounted(() => {
        loadStatus
    })
</script>

<template>
  <Panel header="Neotoma Web Link Status & Reference">
    <div v-if="Object.keys(refs).sort().join() === ['api', 'apidev', 'explorer', 'tilia'].sort().join()">
        <a href="https://api.neotomadb.org">Neotoma API</a> [<span v-if="refs.api === true" class="online">Online</span>
                    <span v-else class="offline">Offline</span>];
        <a href="https://apps.neotomadb.org/explorer">Explorer</a> [<span v-if="refs.explorer === true" class="online">Online</span>
                <span v-else class="offline">Offline</span>];
        <a href="https://apps.neotomadb.org/explorer">Tilia API</a> [<span v-if="refs.tilia === true" class="online">Online</span>
                    <span v-else class="offline">Offline</span>]<br>
        <a href="https://api-dev.neotomadb.org">Development API</a> [<span v-if="refs.apidev === true" class="online">Online</span>
                <span v-else class="offline">Offline</span>]<hr style="margin-top:2px;margin-bottom:2px;">
        <a href="https://open.neotomadb.org/dbschema">Database Schema</a> — <a href="https://open.neotomadb.org/dbschema">Database Manual</a>
    </div>
    <div v-else>
        <ProgressSpinner />
    </div>
</Panel>
</template>

<script>
  export default {
    name: 'datastatus',
  }
</script>
