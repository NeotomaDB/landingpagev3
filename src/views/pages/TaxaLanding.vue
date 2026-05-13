<script setup>
import { ref, onMounted } from 'vue'
import TaxaMap from '@/views/resources/taxaelements/TaxaMap.vue'
import AboutTaxa from '@/views/resources/taxaelements/AboutTaxa.vue'
import TaxaTree from '@/views/resources/taxaelements/TaxaTree.vue'
import { useRoute } from 'vue-router'
import { authedFetch } from '@/functions/apicalls'

const route = useRoute()

const taxondata = ref(null)
const sitenum = ref(null)
const error = ref(null)

async function loadTaxonData() {
    try {
        const response = await authedFetch(`/v2.0/data/taxa/${route.params.taxonid}`, {
            method: 'GET',
            headers: {}
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        const data = await response.json()
        taxondata.value = data.data[0]
    } catch (err) {
        error.value = err
        console.error(err)
    }
}

async function loadSiteCount() {
    try {
        const response = await authedFetch(`/v2.0/data/sites?limit=999999&taxonid=${route.params.taxonid}`, {
            method: 'GET',
            headers: {}
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        const data = await response.json()
        sitenum.value = data.data.length
    } catch (err) {
        error.value = err
        console.error(err)
    }
}

onMounted(async () => {
    await Promise.all([loadTaxonData(), loadSiteCount()])
})
</script>

<template>
    <AboutTaxa />
    <TaxaTree />
    <TaxaMap />
    {{ taxondata }}
    {{ sitenum }}
</template>
