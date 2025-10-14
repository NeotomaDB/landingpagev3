<script setup>
import { onMounted, ref } from 'vue'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner';
import { useRouter } from 'vue-router'

const router = useRouter();

const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT
const props = defineProps(['title'])
const datasets = ref({})
const countsums = ref([])
const loading = ref(true)
const error = ref(null)

async function groupRoles(datasets) {
  var counts = datasets.reduce((p, c) => {
    var roles = c.roles;
    roles.forEach((role, index) => {
      if (!p.hasOwnProperty(role)) {
        p[role] = 0;
      }
      p[role]++;
    })
    return p;
  }, {});
  loading.value = false;
  return counts
}

async function get_contactdatasets(contactid) {
  await fetch(neotomaapi + `/v2.0/apps/contacts/` + contactid + `/datasets`,
    { method: "GET", headers: { 'content-type': 'application/json' } })
    .then(res => {
      if (!res.ok) {
        const error = new Error(res.statusText)
        error.json = { 'error': res.json(), 'contactid': contactid }
        throw error;
      }
      return res.json()
    })
    .then(json => {
      datasets.value = json.data
    })
    .catch(err => {
      error.value = err
      if (err.json) {
        return err.json
      }
    })
}
onMounted(async () => {
  await router.isReady()
  await get_contactdatasets(await props.title)
  countsums.value = await groupRoles(datasets.value)
})
</script>

<template>
  <div v-if="loading">
    <ProgressSpinner class="flex-grow-1 w-max" />
  </div>
  <div v-else>
    <Panel>
      <template #header>
        <h4>User Submission Summary</h4>
      </template>
      <div v-for="(role, index) in countsums">
        <Button :badge="role" :label="index" aria-lable="User Submission Counts" />
      </div>
    </Panel>
  </div>
</template>
