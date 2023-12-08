<script setup>
  import { ref, onMounted, defineProps } from 'vue'
  import Panel from 'primevue/panel';
  import Card from 'primevue/card';
  const props = defineProps(['datasetid'])
  let chronology = ref(null)
  let loading = ref(true)
  const error = ref(null)

  function loadChronology() {
    return fetch("https://api.neotomadb.org/v2.0/data/datasets/" + props.datasetid +'/chronologies', 
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
                  chronid: {{ chron.chronology.chronologyid }}<br>
                  prepared: {{ chron.chronology.datePrepared }}<br>
                  control dates: {{ chron.chronology.controls.length }} <br>
                  reliable age range: {{ chron.chronology.reliableagespan.younger }} - {{ chron.chronology.reliableagespan.older }} {{ chron.chronology.agetype }}<br>
                  model basis: {{ chron.chronology.modelType }}
                
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
