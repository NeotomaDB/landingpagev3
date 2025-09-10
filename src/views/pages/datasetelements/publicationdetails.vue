<script setup>
  import { ref, onMounted } from 'vue'
  import Panel from 'primevue/panel';
  import ProgressSpinner from 'primevue/progressspinner';
  const props = defineProps(['datasetid'])
  let publication = ref(null)
  let loading = ref(true)
  const error = ref(null)
  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

  function loadPublication() {
    return fetch(neotomaapi + "/v2.0/data/datasets/" + props.datasetid +'/publications', 
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
          publication.value = json.data
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
  loadPublication()
})
</script>

<template>
  <Panel toggleable>
    <template #header>
      <h2>Publications</h2>
    </template>
      <div v-if="!loading">
        <div class="grid">
          <div v-for="pub in publication" class="col-6">
            <div class="text-left p-3 border-round surface-ground hover:surface-500">
              {{ pub.publication.citation}}<br>
              <div v-if="pub.publication.doi">
                <strong>DOI:</strong> <a :href="'https://doi.org/' + pub.publication.doi" target="_blank">https://doi.org/{{ pub.publication.doi}}</a>
              </div>
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
    name: 'PublicationDetails',
    data () {
      return {
        msg: 'Mapbox element has rendered.'
      }
    }
  }
</script>
