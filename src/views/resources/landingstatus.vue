<script setup>
import ProgressSpinner from 'primevue/progressspinner'
import { ref, onMounted } from 'vue'
import Panel from 'primevue/panel'
import Badge from 'primevue/badge'

const refs = ref({})

const loadStatus = new Promise(() => {
  fetch(import.meta.env.VITE_APP_APIDEV_ENDPOINT + '/api-docs/', {
    method: 'HEAD',
    mode: 'no-cors'
  })
    .then((response) => {
      refs.value['apidev'] = {
        name: 'Development API',
        status: response.status === 200,
        url: import.meta.env.VITE_APP_APIDEV_ENDPOINT + '/api-docs/'
      }
    })
    .catch((err) => console.log(err))

  fetch(import.meta.env.VITE_APP_API_ENDPOINT + '/api-docs/', {
    method: 'HEAD'
  })
    .then((response) => {
      refs.value['api'] = {
        name: 'Neotoma API',
        status: response.status === 200,
        url: import.meta.env.VITE_APP_API_ENDPOINT + '/api-docs/'
      }
    })
    .catch((err) => console.log(err))

  fetch('https://apps.neotomadb.org/explorer', { mode: 'no-cors', method: 'HEAD' })
    .then((response) => {
      refs.value['explorer'] = {
        name: 'Neotoma Explorer',
        status: response.status === 0,
        url: 'https://apps.neotomadb.org/explorer'
      }
    })
    .catch((err) => console.log(err))

  fetch(import.meta.env.VITE_APP_TILIA_ENDPOINT + '/api', { method: 'HEAD' })
    .then((response) => {
      refs.value['tilia'] = {
        name: 'Tilia API',
        status: response.status === 200,
        url: import.meta.env.VITE_APP_TILIA_ENDPOINT + '/api'
      }
    })
    .catch((err) => console.log(err))
  return null
})

onMounted(() => {
  loadStatus
})
</script>

<template>
  <Panel header="Neotoma Web Link Status & Reference">
    <div
      v-if="
        Object.keys(refs).sort().join() === ['api', 'apidev', 'explorer', 'tilia'].sort().join()
      "
    >
      <div class="grid">
        <div class="col-4 p-3">
          <div v-for="endpoint in refs" class="row p-1 text-center">
            <a
              href="https://api.neotomadb.org"
              class="p-button"
              style="width: 100%; background: #5D584B"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge
                v-if="endpoint.status"
                severity="success"
                style="color: #000000; margin: 5px"
              />
              <Badge v-if="!endpoint.status" severity="danger" style="margin: 5px" />
              <strong>{{ endpoint.name }}</strong>
            </a>
          </div>
        </div>

        <div class="col-4 p-3 align-self-end">
          <div style="width:100%;text-align:center"><i class="pi pi-database" style="font-size: 2.5rem;padding:10px;"/></div>
          <p>The Neotoma Database Schema is a navigable representation of the data tables within the Neotoma Postgres database.</p>
          <a
            href="https://open.neotomadb.org/dbschema"
            class="p-button"
            target="_blank"
            style="width: 100%; background: #5D584B"
            rel="noopener noreferrer"
            >Database Schema</a
          >
          </div>
          <div class="col-4 p-3 align-self-end">
          
            <div style="width:100%;text-align:center"><i class="pi pi-book" style="font-size: 2.5rem;padding:10px"/></div>
            <p>The Neotoma Database Manual provides information about the database, controlled vocabularies and other design decisions.</p>
          <a
            href="https://open.neotomadb.org/manual"
            class="p-button"
            target="_blank"
            style="width: 100%; background: #5D584B"
            rel="noopener noreferrer"
            >Database Manual</a
          >
        
        </div>
      </div>
    </div>
    <div v-else class="flex flex-wrap justify-content-center align-items-center">
      <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
  </Panel>
</template>

<script>
export default {
  name: 'datastatus'
}
</script>
