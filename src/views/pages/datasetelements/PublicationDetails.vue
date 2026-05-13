<script setup>
import { ref, onMounted } from 'vue'
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner'
import { authedFetch } from '@/functions/apicalls'

const props = defineProps(['datasetid'])
let publication = ref(null)
let loading = ref(true)
const error = ref(null)

async function loadPublication() {
    try {
        const res = await authedFetch(`/v2.0/data/datasets/${props.datasetid}/publications`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            const requestError = new Error(res.statusText)
            requestError.json = res.json()
            throw requestError
        }

        const json = await res.json()
        publication.value = json.data
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
    await loadPublication()
})
</script>

<template>
    <Panel toggleable>
        <template #header>
            <h2>Publications</h2>
        </template>
        <div v-if="!loading">
            <div class="grid">
                <div v-for="pub in publication" class="col-6">
                    <div class="text-left p-3 border-round surface-ground hover:surface-500">
                        {{ pub.publication.citation }}<br />
                        <div v-if="pub.publication.doi">
                            <strong>DOI:</strong>
                            <a :href="`https://doi.org/${pub.publication.doi}`" target="_blank"
                                >https://doi.org/{{ pub.publication.doi }}</a
                            >
                        </div>
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
    name: 'PublicationDetails',
    data() {
        return {
            msg: 'Mapbox element has rendered.'
        }
    }
}
</script>
