<script setup>

import { defineAsyncComponent } from 'vue'
import ProgressSpinner from 'primevue/progressspinner';
import Panel from 'primevue/panel'

const SiteMap = defineAsyncComponent({
  loader: () => import("@/views/resources/MapSite.vue"),
  loadingComponent: ProgressSpinner,
  delay: 200,
  timeout: 3000
})

const NativeMap = defineAsyncComponent({
  loader: () => import("@/views/pages/datasetelements/NativeLandMap.vue"),
  loadingComponent: ProgressSpinner,
  delay: 200,
  timeout: 3000
})

const props = defineProps(['title'])
</script>

<template>
  <Panel>
    <template #header>
      <div style="width:100%;">
        <h2 style="display:inline;">Site Details for {{ props.title.site.sitename }}</h2>
        <div style="text-align:right;float:right;">
          {{ props.title.site.datasets[0].database }}
        </div>
      </div>
    </template>

    <div v-if="props.title.site">
      <div class="grid" style="padding:1rem">
        <div class="col-8">
          <strong>Site Name:</strong> {{ props.title.site.sitename }}<br />
          <strong>Description: </strong>
          <span v-if="props.title.site.sitedescription">
            <em>{{ props.title.site.sitedescription }}</em>
          </span>
          <span v-else> None</span>
          <br />
          <strong>Notes: </strong>
          <span v-if="props.title.site.sitenotes">
            <em> {{ props.title.site.sitenotes }}</em>
          </span>
          <span v-else> None</span>
        </div>
        <div class="col" style="max-height:200px">
          <SiteMap :location="props.title.site.geography" style="border:1px solid black" />
        </div>
      </div>
      <br>
      <NativeMap :location="props.title.site.geography" />
    </div>
  </Panel>
</template>