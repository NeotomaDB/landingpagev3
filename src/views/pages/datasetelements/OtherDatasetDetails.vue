<script setup>
import { ref, onMounted } from 'vue'
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'
import { authedFetch } from '@/functions/apicalls'
const props = defineProps(['siteid', 'datasetid'])
let otherDatasets = ref(null)
let loading = ref(true)
const error = ref(null)

async function loadOtherDatasets() {
    try {
        const res = await authedFetch(`/v2.0/data/sites/${props.siteid}/datasets`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            const requestError = new Error(res.statusText)
            requestError.json = res.json()
            throw requestError
        }

        const json = await res.json()
        otherDatasets.value = json.data
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
    await loadOtherDatasets()
})
</script>

<template>
    <Panel toggleable>
        <template #header>
            <h2>Other Datasets at this Site</h2>
        </template>
        <div v-if="!loading">
            <div v-if="error">
                {{ error }}
            </div>
            <div v-else>
                <div class="grid">
                    <div v-for="collunits in otherDatasets" class="col-6">
                        <Card>
                            <template #header>Collection Unit {{ collunits.site.handle }}</template>
                            <template #content>
                                <div v-for="dsets in collunits.site.datasets">
                                    <div class="text-left p-3 border-round surface-ground hover:surface-500">
                                        <strong>Dataset Type:</strong> {{ dsets.datasettype }}
                                        <span v-if="dsets.datasetid == props.datasetid">(this dataset)</span><br />
                                        <div v-if="dsets.doi[0]">
                                            <strong>DOI:</strong>
                                            <a :href="`https://doi.org/${dsets.doi[0]}`">{{ dsets.doi[0] }}</a
                                            ><br />
                                        </div>
                                        <div v-else><strong>DOI:</strong> None Minted.</div>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <ProgressSpinner />
        </div>
    </Panel>
</template>

<script>
export default {
    name: 'otherDatasetDetails',
    data() {
        return {
            msg: 'Mapbox element has rendered.'
        }
    }
}
</script>
