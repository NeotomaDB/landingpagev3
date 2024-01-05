<script setup>
  import { ref, onMounted, defineProps } from 'vue'
  import Panel from 'primevue/panel';
  import Card from 'primevue/card';
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
          <div class="flex flex-row flex-wrap">
            <div v-for="pub in publication">
              <Card class="max-w-30rem h-full">
                  <template #content>
                      {{ pub.publication.citation}}<br>
                      <div v-if="pub.publication.doi">
                        <strong>DOI:</strong> <a href="https://doi.org/{{ pub.publication.doi}}">https://doi.org/{{ pub.publication.doi}}</a>
                      </div>
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
    name: 'PublicationDetails',
    data () {
      return {
        msg: 'Mapbox element has rendered.'
      }
    }
  }
</script>
