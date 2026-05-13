<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
import { authedFetch } from '@/functions/apicalls'
const route = useRoute()

const datasetinfo = ref(null)
const loading = ref(true)
const error = ref(null)
const visible = ref(false)

async function callTaxa() {
    try {
        const res = await authedFetch(`/v2.0/data/datasets/${route.params.datasetid}/taxa`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            const requestError = new Error(res.statusText)
            requestError.json = { error: res.json(), datasetid: route.params.datasetid }
            throw requestError
        }

        const json = await res.json()
        const taxon_list = json.data
        taxon_list.sort((a, b) => (a.ecolgroup > b.ecolgroup ? 1 : b.ecolgroup > a.ecolgroup ? -1 : 0))
        datasetinfo.value = taxon_list
    } catch (err) {
        error.value = err
        if (err.json) {
            const json = await err.json.error
            error.value.message = json.message
        }
    } finally {
        loading.value = false
    }
}
onMounted(async () => {
    await callTaxa()
})
</script>

<template>
    <Panel toggleable collapsed>
        <template #header>
            <h3>Taxa and Variables Reported</h3>
        </template>
        <div class="grid" style="grid-auto-rows: 1fr">
            <div v-for="element in datasetinfo" :key="element.taxonname">
                <Chip :label="element.taxonname" @click="visible = true" class="m-1" style="cursor: pointer"> </Chip>
            </div>
        </div>
    </Panel>
</template>

<script>
export default {
    name: 'TaxaDetails',
    data() {
        return {
            msg: 'Loaded the taxa.'
        }
    }
}
</script>
