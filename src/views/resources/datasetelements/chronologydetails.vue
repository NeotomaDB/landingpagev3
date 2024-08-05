<script setup>
  import { ref, onMounted } from 'vue'
  import Panel from 'primevue/panel';
  import Card from 'primevue/card';
  const props = defineProps(['datasetid'])
  let chronology = ref(null)
  let loading = ref(true)
  const error = ref(null)

const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

  function loadChronology() {
    return fetch(neotomaapi + "/v2.0/data/datasets/" + props.datasetid +'/chronologies', 
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
          chronology.value = json.data
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
  loadChronology()
})
</script>

<template>
  <Panel toggleable>
    <template #header>
      <h2>Chronologies</h2>
    </template>
      <div v-if="!loading">
        <div class="grid">
          <div class="flex flex-row flex-wrap">
            <div v-for="chron in chronology">
              <Card>
                <template #header>
                  <h3>{{ chron.chronology.chronologyName }}</h3>
                </template>
                <template #content>
                  <strong>Chronology ID:</strong> {{ chron.chronology.chronologyid }}<br>
                  <strong>Date Prepared:</strong> {{ chron.chronology.datePrepared }}<br>
                  <strong>Chronological Controls Used:</strong> {{ chron.chronology.controls.length }} <br>
                  <strong>Reliable Age Range:</strong> {{ chron.chronology.reliableagespan.younger }} - {{ chron.chronology.reliableagespan.older }} {{ chron.chronology.agetype }}<br>
                  <strong>Model Basis:</strong> {{ chron.chronology.modelType }}
                
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        LOADING
      </div>
  </Panel>
</template>

<script>
  export default {
    name: 'ChronologyDetails',
    data () {
      return {
        msg: 'Mapbox element has rendered.'
      }
    }
  }
</script>
