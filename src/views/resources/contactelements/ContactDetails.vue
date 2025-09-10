<script setup>
import { onMounted, ref } from 'vue'
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner';
import { useRouter } from 'vue-router'

const router = useRouter();

const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT
const props = defineProps(['title'])
const contactinfo = ref({})
const loading = ref(true)
const error = ref(null)

async function get_contact(contactid) {
  await fetch(neotomaapi + "/v2.0/data/contacts/" + contactid,
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
      contactinfo.value = json.data[0]
      loading.value = false;
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
  contactinfo.value = await get_contact(props.title)
})
</script>

<template>
  <div v-if="loading">
    <ProgressSpinner class="flex-grow-1 w-max" />
  </div>
  <div v-else>
    <Panel :header="contactinfo['contactname']">
      email:{{ contactinfo['email'] }}
    </Panel>
  </div>
</template>
