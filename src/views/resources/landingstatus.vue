<script setup>
import ProgressSpinner from 'primevue/progressspinner'
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Badge from 'primevue/badge'

const refs = ref({})

const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 5000)

const apidev = import.meta.env.VITE_APP_APIDEV_ENDPOINT ?? 'https://api-dev.neotomadb.org'
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
const tiliaapi = import.meta.env.VITE_APP_TILIA_ENDPOINT ?? 'https://tilia.neotomadb.org'

const loadStatus = new Promise(() => {
  fetch(apidev + '/api-docs/', {
    method: 'HEAD',
    mode: 'no-cors',
    signal: controller.signal
  })
    .then((response) => {
      refs.value['apidev'] = {
        name: 'Development API',
        status: response.status === 200,
        url: apidev + '/api-docs/'
      }
    })
    .catch((err) => {
      refs.value['apidev'] = {
        name: 'Development API',
        status: false,
        url: apidev + '/api-docs/'
      }
      console.log(err)
    })

  fetch(neotomaapi + '/api-docs/', {
    method: 'HEAD',
    signal: controller.signal
  })
    .then((response) => {
      refs.value['api'] = {
        name: 'Neotoma API',
        status: response.status === 200,
        url: neotomaapi + '/api-docs/'
      }
    })
    .catch((err) => {
      refs.value['api'] = {
        name: 'Neotoma API',
        status: false,
        url: neotomaapi + '/api-docs/'
      }
      console.log(err)})

  fetch('https://apps.neotomadb.org/explorer', {
    mode: 'no-cors', 
    method: 'HEAD',
    signal: controller.signal })
    .then((response) => {
      refs.value['explorer'] = {
        name: 'Neotoma Explorer',
        status: response.status === 200,
        url: 'https://apps.neotomadb.org/explorer'
      }
    })
    .catch((err) => {
      refs.value['explorer'] = {
        name: 'Neotoma Explorer',
        status: false,
        url: 'https://apps.neotomadb.org/explorer'
      }
      console.log(err)
    })

  fetch(tiliaapi + '/api', {
    method: 'HEAD',
    signal: controller.signal })
    .then((response) => {
      refs.value['tilia'] = {
        name: 'Tilia API',
        status: response.status === 200,
        url: tiliaapi + '/api'
      }
    })
    .catch((err) => {
      refs.value['tilia'] = {
        name: 'Tilia API',
        status: false,
        url: tiliaapi + '/api'}
      
      console.log('tilia' + err)
    })
  return null
})

onMounted(() => {
  loadStatus
})
</script>

<template>
  <Card header="Neotoma Web Link Status & Reference">
  <template #content>
    <div
      v-if="
        Object.keys(refs).sort().join() === ['api', 'apidev', 'explorer', 'tilia'].sort().join()
      "
    >
      <div class="grid">
        <div class="col-4 p-3">
          <div v-for="endpoint in refs" class="row m-1">
            <a
              :href="refs.url"
              class="p-button"
              style="width: auto; background: #5D584B; display:block;"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge
                v-if="endpoint.status"
                severity="success"
                style="color: #000000"
                class="p-2 mr-5 ml-5"
              />
              <Badge v-if="!endpoint.status" severity="danger" class="p-2 mr-5 ml-5" />
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
            style="width: auto; display:block; text-align: center;background: #5D584B"
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
            style="width: auto; display:block; text-align: center; background: #5D584B"
            rel="noopener noreferrer"
            >Database Manual</a
          >
        
        </div>
      </div>
    </div>
    <div v-else class="flex flex-wrap justify-content-center align-items-center">
      <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
  </template>
  </Card>
</template>

<script>
export default {
  name: 'datastatus'
}
</script>
