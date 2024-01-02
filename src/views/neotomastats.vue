<script setup>
    import { ref } from 'vue'
    import Badge from 'primevue/badge';
    import Card from 'primevue/card';
    import ProgressSpinner from 'primevue/progressspinner';
    import Dialog from 'primevue/dialog';
    const rawstats = ref(null)
    const loaderror = ref(null)
    const visible = ref(false)
    const today = new Date().toLocaleString() 
    fetch(import.meta.env.VITE_APP_API_ENDPOINT + '/v2.0/data/summary/rawbymonth?end=999999',
    { method: "GET",
      headers: {
      "Content-Type": "application/json",
      "User-Agent": "ndb landing pages",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }})
        .then(response => response.json())
        .then(data => rawstats.value = data['data']['data'][0])
        .catch(err => {
          rawstats.value = "error"
          loaderror.value = { 'uri': import.meta.env.VITE_APP_API_ENDPOINT + '/v2.0/data/summary/rawbymonth?end=999999',
                              'error': err }
        })
</script>

<template>
    <Card>
      <template #content>
        <div v-if="rawstats"  @click="visible = true">
          <div v-if="loaderror" class="flex justify-content-center">
            <i class="pi pi-exclamation-circle"></i> Current Neotoma Statistics are unavailable.
          </div>
          <div v-else>
            <h4>As of {{ today }}:</h4>
            <p>Neotoma manages <Badge :value="rawstats.datasets" /> datasets by <Badge :value="rawstats.authors" /> authors, from <Badge :value="rawstats.publications" /> publications across <Badge :value="rawstats.countrygpid" /> countries.</p>
          </div>
        </div>
        <div v-if="!rawstats" class="flex flex-wrap justify-content-center align-items-center">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
    animationDuration=".5s" aria-label="Loading" class="flex-grow-1 w-max" />
        </div>
      </template>
      </Card>
      <Dialog v-model:visible="visible" header="Error Message" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :modal="true" :draggable="false">
        <p class="m-0">{{ loaderror }}</p>
      </Dialog>
</template>

<script>
  export default {
    name: 'DatasetStatistics',
    data () {
      return {
        msg: 'Exporting the Neotoma Statistics Chunk.'
      }
    }
  }
</script>
