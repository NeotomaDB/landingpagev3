<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

const route = useRoute()

const datasetinfo = ref(null)
const loading = ref(true)
const error = ref(null)
const visible = ref(false)

const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'


function callTaxa() {
  return fetch(
    neotomaapi +
      '/v2.0/data/datasets/' +
      route.params.datasetid +
      '/taxa',
    { method: 'GET', headers: { 'content-type': 'application/json' } }
  )
    .then((res) => {
      if (!res.ok) {
        const error = new Error(res.statusText)
        error.json = { error: res.json(), datasetid: route.params.datasetid }
        throw error
      }
      return res.json()
    })
    .then((json) => {
      datasetinfo.value = json.data
      loading.value = false
    })
    .catch((err) => {
      error.value = err
      if (err.json) {
        return err.json.then((json) => {
          // set the JSON response message
          error.value.message = json.message
        })
      }
    })
}
onMounted(() => {
  callTaxa()
})
</script>

<template>
  <Panel toggleable collapsed>
    <template #header>
      <h3>Taxa and Variables Reported</h3>
      
    </template>
    <div class="grid" style="grid-auto-rows: 1fr;">
    <div v-for="element in datasetinfo">
      <Chip :label="element.taxonname" @click="visible = true" style="cursor:pointer">
      </Chip>
      <Dialog
        v-model:visible="visible"
        modal
        :header="element.taxonname"
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
      <pre>{{ JSON.stringify(element, null, 2) }}</pre>
      </Dialog>
    </div>
</div>
  </Panel>
</template>

<script>
export default {
  name: 'TaxaDetails',
  data() {
    return {
      msg: 'Loaded the taxa.'
    }
  }
}
</script>
