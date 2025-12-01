<!-- This component is used as the page for removed datasets. The goal here is to
     provide some information for the user, both with regards to what happened to 
     the dataset, and also to redirect the user to a possible replacement dataset.
-->

<script setup>
import { onMounted, ref } from 'vue'
import Panel from 'primevue/panel'
import { useRoute, useRouter } from 'vue-router'

import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const route = useRoute();
const router = useRouter();

let datasetid = ref(null)
let datasetmeta = ref(null)
let datasetdoi = ref(null)
let loading = ref(true)

const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
const dataciteapi = import.meta.env.VITE_APP_DOI_ENDPOINT ?? 'https://api.datacite.org/dois/'

async function getDatasetDOI() {
  datasetid.value = route.params.datasetid;
  if (datasetid.value) {
    const response = await fetch(neotomaapi + '/v2.0/data/datasets/' + datasetid.value + '/doi', {
      method: 'GET',
    }
    )
    if (!response.ok) {
      loading.value = false
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    datasetdoi.value = json['data'][0]['dois']
  }
};
async function dataciteMeta(doi) {
  const response = await fetch(dataciteapi + doi, {
    method: 'GET',
  }
  )
  if (!response.ok) {
    loading.value = false
    console.log('Issue with the API call.')
    throw new Error(`Response status: ${response.status}`);
  }
  const json = await response.json();
  return await json['data']['attributes']
}

onMounted(async () => {
  await router.isReady()
  await getDatasetDOI()
  datasetmeta.value = await dataciteMeta(datasetdoi.value);
});


</script>

<template>
  <Panel>
    <template #header>
      <h1>This Dataset Has Been Removed</h1>
    </template>
    <p>This dataset does not exist in Neotoma. It may have been removed from Neotoma, or a new dataset ID and DOI has
      been added to supercede this record.</p>
    <p>To find the new dataset, you can examine the DOI metadata and search by sitename, contributor or dataset
      type using <a href='https://apps.neotomadb.org/explorer'>Neotoma Explorer</a>, the <a
        href='https://cran.r-project.org/web/packages/neotoma2/index.html'>neotoma2 R package</a> or the <a
        href='https://api.neotomadb.org'>Neotoma API</a>.</p>
    <p>You may also use the <a href="https://commons.datacite.org/" target="_blank">DataCite Commons</a> to check the
      DOI.
    </p>
    <Panel header="DOI Metadata" toggleable collapsed>
      <vue-json-pretty :data="datasetmeta" />
    </Panel>
  </Panel>
</template>