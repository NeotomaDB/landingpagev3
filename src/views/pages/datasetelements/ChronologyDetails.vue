<script setup>
import { ref, onMounted } from 'vue'
import Panel from 'primevue/panel'
import { authedFetch } from '@/functions/apicalls'

const props = defineProps(['datasetid'])
let chronology = ref(null)
let loading = ref(true)
const error = ref(null)

async function loadChronology() {
    try {
        const res = await authedFetch(`/v2.0/data/datasets/${props.datasetid}/chronologies`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            const requestError = new Error(res.statusText)
            requestError.json = res.json()
            throw requestError
        }

        const json = await res.json()
        chronology.value = json.data
    } catch (err) {
        error.value = err
        if (err.json) {
            const json = await err.json
            error.value.message = json.message
        }
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await loadChronology()
})
</script>

<template>
    <Panel toggleable>
        <template #header>
            <h3>Chronologies</h3>
        </template>
        <div v-if="!loading">
            <div class="grid">
                <div v-for="chron in chronology" class="col-6">
                    <div class="text-left p-3 border-round surface-ground hover:surface-500">
                        <h3>{{ chron.chronology.chronologyName }}</h3>
                        <strong>Chronology ID:</strong> {{ chron.chronology.chronologyid }}<br />
                        <strong>Date Prepared:</strong> {{ chron.chronology.datePrepared }}<br />
                        <strong>Chronological Controls Used:</strong> {{ chron.chronology.controls.length }} <br />
                        <strong>Reliable Age Range:</strong> {{ chron.chronology.reliableagespan.younger }} -
                        {{ chron.chronology.reliableagespan.older }} {{ chron.chronology.agetype }}<br />
                        <strong>Model Basis:</strong> {{ chron.chronology.modelType }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else>LOADING</div>
    </Panel>
</template>

<script>
export default {
    name: 'ChronologyDetails',
    data() {
        return {
            msg: 'Mapbox element has rendered.'
        }
    }
}
</script>
