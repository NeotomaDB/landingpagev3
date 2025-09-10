<script setup>
  import { ref, computed } from 'vue'
  import Panel from 'primevue/panel'
  import DatasetStatistics from '@/views/NeotomaStats.vue'

  const images = ref(['centralamerica-fs8.png','australia-fs8.png',
    'easternna-fs8.png','japan-fs8.png',
    'pacific_coast-fs8.png','southamerica-fs8.png','westernasia-fs8.png'])

  const imageref = computed(() => {
    var random = Math.floor(Math.random() * images.value.length);
        return new URL('../../maps/' + images.value[random], import.meta.url).href;
  })

</script>

<template>
      <panel>
        <template #header>
          <h1>Neotoma Paleoecology Landing Pages</h1>
        </template>
      <img :src=imageref style="width:100%">
      <p>This site is a resource for obtaining extended metadata about Neotoma resources. These landing pages also serve as a platform for DOI resolution.</p>
      <p>To access information about an individual Neotoma Dataset include the dataset ID in the URL: <strong>https://data.neotomadb.org/{DatasetID}</strong>, for example, the dataset for the <em>Lake Tulane Loss on Ignition dataset</em> can be found at <router-link to="/datasets/2662">https://data.neotomadb.org/2662</router-link>.</p>
      <p><strong>NOTE:</strong> This page is informational and will not directly lead to datasets. To explore Neotoma datasets interactively please use the <a href="https://apps.neotomadb.org/Explorer">Neotoma Explorer</a>.</p>
      <p>This application is managed and maintained as an open-source project on the <a href="https://github.com/NeotomaDB/landingpagev3">Neotoma GitHub Repository</a>.</p>
      
      <DatasetStatistics />
      </panel>
</template>

<script>
  export default {
    name: 'emptyPage',
    data () {
      return {}
      }
    }
</script>
