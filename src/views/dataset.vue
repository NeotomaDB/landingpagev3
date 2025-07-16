<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Panel from 'primevue/panel'
  import Card from 'primevue/card'
  import ProgressSpinner from 'primevue/progressspinner';
  import SiteDetails from "@/views/resources/datasetelements/sitedetails.vue"
  import DatasetDetails from "@/views/resources/datasetelements/datasetdetails.vue"

  const route = useRoute()
  const router = useRouter();

  const datasetinfo = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

  async function loadDataset() {
    fetch(neotomaapi + "/v2.0/data/datasets/" + route.params.datasetid, 
      { method: "GET", headers: {'content-type': 'application/json'}})
        .then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText)
            error.json = {'error': res.json(), 'datasetid':route.params.datasetid}
            throw error;
          }
          return res.json()
        })
        .then(json => {
          datasetinfo.value = json.data[0]
          loading.value = false;
        })
        .catch(err => {
          error.value = err
          if(err.json) {
            return err.json.then(json => {
            // set the JSON response message
            error.value.message = json.message;
            });
          }
        })
  }

onMounted(async () => {
  await router.isReady()
  if (route.params.datasetid) {
    await loadDataset()
  }
})
</script>

<template>
    <div v-if="datasetinfo">
      <div v-if="!loading"> 
        <SiteDetails :title="datasetinfo" />
        <DatasetDetails :title="datasetinfo" />
      </div>
      <div v-else class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />
      </div>
    </div>
    <div v-else>
      <Panel>
        <template #header>
          <h1>Neotoma Datasets</h1>
        </template>
        <p>This page leads to information relating to Neotoma datasets themselves. It includes information about dataset contacts, publications and other critical information about Neotoma records.</p>
        <p>Dataset pages also include information about taxa presence at sites, and other associated metadata. From the dataset landing pages you can download JSON formatted versions of the data to be used locally.</p>
        <Card>
        <template #content>
          Dataset search coming soon.
        </template>
      </Card>
      </Panel>
    </div>
</template>

<script>
export default {
  data() {
    return {
      datasetinfo: "",
    };
  },
}
</script>