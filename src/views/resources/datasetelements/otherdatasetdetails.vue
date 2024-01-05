<script setup>
  import { ref, onMounted } from 'vue'
  import Panel from 'primevue/panel';
  import Card from 'primevue/card';
  import ProgressSpinner from 'primevue/progressspinner';
  const props = defineProps(['siteid'])
  let otherDatasets = ref(null)
  let loading = ref(true)
  const error = ref(null)
  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

  function loadOtherDatasets() {
    return fetch(neotomaapi + "/v2.0/data/sites/" + props.siteid + '/datasets', 
      { method: "GET", headers: {'content-type': 'application/json'}})
        .then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText)
            error.json = res.json()
            throw error;
          }
          return res.json()
        })
        .then(json => {
          otherDatasets.value = json.data[0].site.datasets
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

onMounted(() => {
  loadOtherDatasets()
})
</script>

<template>
  <Panel toggleable>
    <template #header>
      <h2>Other Datasets at this Site</h2>
    </template>
      <div v-if="!loading">
        <div class="grid">
          <div class="flex flex-row flex-wrap">
            <div v-for="dsets in otherDatasets">
              <Card>
                <template #content>
                  <strong>Dataset Type:</strong> {{ dsets.datasettype }}<br>
                  <div v-if="dsets.doi[0]">
                  <strong>DOI:</strong> <a href="https://doi.org/{{ dsets.doi[0] }}">{{dsets.doi[0]}}</a><br>
                  </div>
                  <div v-else><strong>DOI:</strong> None Minted.</div>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <ProgressSpinner />
      </div>
  </Panel>
</template>

<script>
  export default {
    name: 'otherDatasetDetails',
    data () {
      return {
        msg: 'Mapbox element has rendered.'
      }
    }
  }
</script>
