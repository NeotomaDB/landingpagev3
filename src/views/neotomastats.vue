<script setup>
import { ref } from 'vue'
import Badge from 'primevue/badge'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'
const rawstats = ref(null)
const loaderror = ref(null)
const visible = ref(false)
const today = new Date().toLocaleString()

const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

fetch(neotomaapi + '/v2.0/data/summary/rawbymonth?end=999999', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'ndb landing pages'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  }
})
  .then((response) => response.json())
  .then((data) => (rawstats.value = data['data']['data'][0]))
  .catch((err) => {
    rawstats.value = 'error'
    loaderror.value = {
      uri: neotomaapi + '/v2.0/data/summary/rawbymonth?end=999999',
      error: err
    }
  })
</script>

<template>
  <Card>
    <template #content>
      <div v-if="rawstats">
        <div v-if="loaderror" class="flex justify-content-center">
          <i class="pi pi-exclamation-circle"></i> Current Neotoma Statistics are unavailable.
        </div>
        <div v-else>
          <h4>As of {{ today }}:</h4>
          <p>
            Neotoma manages <Badge :value="rawstats.datasets" /> datasets by
            <Badge :value="rawstats.authors" /> authors, from
            <Badge :value="rawstats.publications" /> publications across
            <Badge :value="rawstats.countrygpid" /> countries.
          </p>
        </div>
      </div>
      <div v-if="!rawstats" class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
          aria-label="Loading"
          class="flex-grow-1 w-max"
        />
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  name: 'DatasetStatistics',
  data() {
    return {
      msg: 'Exporting the Neotoma Statistics Chunk.'
    }
  }
}
</script>
