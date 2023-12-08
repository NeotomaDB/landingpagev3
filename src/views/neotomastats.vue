<script setup>
    import { ref } from 'vue'
    import ProgressSpinner from 'primevue/progressspinner';
    const rawstats = ref(null)
    fetch('https://api.neotomadb.org/v2.0/data/summary/rawbymonth?end=999999')
        .then(response => response.json())
        .then(data => rawstats.value = data['data']['data'][0])
</script>

<template>
    <div class="headerbox" style='padding-left:10px;'>
        <div v-if="rawstats">
            <h4>As of today:</h4>
            <p>Neotoma manages <strong>{{rawstats.datasets}}</strong> datasets by <strong>{{rawstats.authors}}</strong> authors, from <strong>{{rawstats.publications}}</strong> publications across <strong>{{rawstats.countrygpid}}</strong> countries.</p>
        </div>
        <div v-if="!rawstats">
          <ProgressSpinner   style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
    animationDuration=".5s" aria-label="Loading" />
        </div>
    </div>
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
