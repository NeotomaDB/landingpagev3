<script setup>

import ProgressSpinner from 'primevue/progressspinner';
import { ref, onMounted } from 'vue'
import Panel from 'primevue/panel';
import Card from 'primevue/card';
import Badge from 'primevue/badge';
import Button from 'primevue/button';

const refs = ref({})

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
  <div class="flex flex-wrap justify-content-center align-items-center">
  <Panel header="Neotoma Web Link Status & Reference">
    <div v-if="Object.keys(refs).sort().join() === ['api', 'apidev', 'explorer', 'tilia'].sort().join()">
      <span class="p-buttonset">
        <Button href="https://api.neotomadb.org">Neotoma API <Badge v-if="refs.api === true" severity="success">Online</Badge>
                    <Badge v-else class="offline">Offline</Badge></Button>
        <Button href="https://apps.neotomadb.org/explorer">Explorer <Badge v-if="refs.explorer === true" severity="success">Online</Badge>
                <Badge v-else class="offline">Offline</Badge></Button>
        <Button href="https://apps.neotomadb.org/explorer">Tilia API <Badge v-if="refs.tilia === true" severity="success">Online</Badge>
                    <Badge v-else class="offline">Offline</Badge></Button>
        <Button href="https://api-dev.neotomadb.org">Development API <Badge v-if="refs.apidev === true" severity="success">Online</Badge>
                <Badge v-else class="offline">Offline</Badge></Button>
      </span>
      <Card>
        <template #content>
          <a href="https://open.neotomadb.org/dbschema" class="p-button">Database Schema</a> <a href="https://open.neotomadb.org/dbschema" class="p-button">Database Manual</a>
        </template>
      </Card>
    </div>
    <div v-else class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner  class="flex-grow-1 w-max" />
    </div>
</Panel>
</div>
</template>

<script>
  export default {
    name: 'datastatus',
  }
</script>
