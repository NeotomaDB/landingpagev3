<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner';

const SiteDetails = defineAsyncComponent({
  loader: () => import("@/views/pages/datasetelements/SiteDetails.vue"),
  loadingComponent: ProgressSpinner,
  delay: 200,
  timeout: 3000
})

const DatasetDetails = defineAsyncComponent({
  loader: () => import("@/views/pages/datasetelements/DatasetDetails.vue"),
  loadingComponent: ProgressSpinner,
  delay: 200,
  timeout: 3000
})

const MissingDataset = defineAsyncComponent({
  loader: () => import("@/views/pages/MissingDataset.vue"),
  loadingComponent: ProgressSpinner,
  delay: 200,
  timeout: 3000
})

const route = useRoute()
const router = useRouter();

const datasetinfo = ref(1)
const datasetid = ref(null)
const loading = ref(true)
const error = ref(null)
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

async function loadDataset() {
  return fetch(neotomaapi + "/v2.0/data/datasets/" + route.params.datasetid,
    { method: "GET", headers: { 'content-type': 'application/json' } })
    .then(res => {
      if (!res.ok) {
        const error = new Error(res.statusText)
        error.json = { 'error': res.json(), 'datasetid': route.params.datasetid }
        throw error;
      }
      return res.json()
    })
    .then(json => {
      return json.data[0];
    })
    .catch(err => {
      error.value = err
      if (err.json) {
        return err.json.then(json => {
          // set the JSON response message
          error.value.message = json.message;
        });
      }
    })
}

onMounted(async () => {
  await router.isReady()
  if (route.params.datasetid && route.params.datasetid != 'datasets') {
    datasetid.value = route.params.datasetid
  }
  if (datasetid.value) {
    datasetinfo.value = await loadDataset()
    loading.value = false;
  } else {
    loading.value = false;
  }

})
</script>

<template>
  <div v-if="!datasetid">
    <Panel>
      <template #header>
        <h1>Neotoma Datasets</h1>
      </template>
      <p>This page leads to information relating to Neotoma datasets themselves. It includes information about dataset
        contacts,
        publications and other critical information about Neotoma records.</p>
      <p>Dataset pages also include information about taxa presence at sites, and other associated metadata. From the
        dataset
        landing pages you can download JSON formatted versions of the data to be used locally.</p>
      <Card>
        <template #content>
          Dataset search coming soon.
        </template>
      </Card>
    </Panel>
  </div>
  <div v-else>
    <div v-if="loading">
      <div class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />
      </div>
    </div>
    <div v-else>
      <div v-if="datasetinfo">
        <SiteDetails :title="datasetinfo" />
        <DatasetDetails :title="datasetinfo" />
      </div>
      <div v-else>
        <MissingDataset></MissingDataset>
      </div>
    </div>
  </div>


</template>
