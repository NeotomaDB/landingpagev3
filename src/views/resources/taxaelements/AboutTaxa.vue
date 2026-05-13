<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import Panel from 'primevue/panel'
import { authedFetch } from '@/functions/apicalls'

const route = useRoute()
const taxon = ref(null)
const name = ref(null)
const hightaxon = ref(null)
const loading_ab = ref(false)
const high1 = ref(null)
const highname = ref(null)
const author = ref(null)
const status = ref(null)
const pub = ref(null)
const ecolgroups = ref(null)
const ecolgroup = ref(null)
const ecolgroupname = ref(null)
const link = ref(null)
const externals = ref(null)

async function loadAbout() {
    const res1 = await authedFetch(`/v2.0/data/taxa/${route.params.taxonid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
    })

    if (!res1.ok) {
        throw new Error(res1.statusText)
    }

    const json1 = await res1.json()
    taxon.value = json1.data
    high1.value = taxon.value[0].highertaxonid
    link.value = `https://data.neotomadb.org/taxa/${high1.value}`
    name.value = taxon.value[0].taxonname
    author.value = taxon.value[0].author
    pub.value = taxon.value[0].publication
    status.value = taxon.value[0].status

    const res2 = await authedFetch(`/v2.0/data/taxa/${high1.value}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
    })

    if (!res2.ok) {
        throw new Error(res2.statusText)
    }

    const json2 = await res2.json()
    hightaxon.value = json2.data
    ecolgroup.value = hightaxon.value[0].ecolgroup
    highname.value = hightaxon.value[0].taxonname

    return hightaxon.value[0].ecolgroup
}

async function loadEcol() {
    const res3 = await authedFetch('/v2.0/data/dbtables/ecolgrouptypes?count=false&limit=9999', {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
    })

    if (!res3.ok) {
        throw new Error(res3.statusText)
    }

    const json3 = await res3.json()
    console.log(ecolgroup.value)
    ecolgroups.value = json3.data.find((item) => item.ecolgroupid == ecolgroup.value)
    ecolgroupname.value = ecolgroups.value.ecolgroup
}

async function loadExternal() {
    const res4 = await authedFetch(`/v2.0/apps/exttax?taxonid=${route.params.taxonid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
    })

    if (!res4.ok) {
        throw new Error(res4.statusText)
    }

    const json4 = await res4.json()
    externals.value = json4.data
}

onMounted(async () => {
    try {
        await loadAbout()
        await loadEcol()
        await loadExternal()
        loading_ab.value = true
    } catch (err) {
        console.log(err)
    }
})
</script>

<style>
h3 {
    padding-left: 10px;
}
</style>

<template>
    <Panel toggleable>
        <template #header>
            <h2>About {{ name }}</h2>
        </template>
        <div v-if="loading_ab">
            <h3>Taxon Summary</h3>
            <ul>
                <li>Authority: {{ author }}</li>
                <li>Publication: {{ pub }}</li>
                <li>
                    Higher Taxon: <a :href="link">{{ highname }} </a>
                </li>
                <li>Status: {{ status }}</li>
                <li>Ecological Group: {{ ecolgroupname }}</li>
                <div v-for="item in externals">
                    <div v-if="item.extdatabasename == 'GBIF Backbone Taxonomy'">
                        <li>
                            {{ item.extdatabasename }}:
                            <a :href="`https://www.gbif.org/species/${item.exttaxonid}`">{{ item.exttaxonid }}</a>
                        </li>
                    </div>
                    <div v-else-if="item.extdatabasename == 'NCBI Taxonomy Database'">
                        <li>
                            {{ item.extdatabasename }}:
                            <a
                                :href="`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${item.exttaxonid}`"
                                >{{ item.exttaxonid }}</a
                            >
                        </li>
                    </div>
                    <div v-else-if="item.extdatabasename != null">
                        <li>{{ item.extdatabasename }}: {{ item.exttaxonid }}</li>
                    </div>
                </div>
            </ul>
        </div>
        <div v-else class="flex flex-wrap justify-content-center align-items-center">
            <ProgressSpinner class="flex-grow-1 w-max" />
        </div>
    </Panel>
</template>
