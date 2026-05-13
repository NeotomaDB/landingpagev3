<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { authedFetch } from '@/functions/apicalls'

const loading_some = ref(true)
const globalFilter = ref('')
const databaseinfo = ref(null)
const databasekeys = ref(null)
const databasename = ref(null)
const currentDB = ref(null)
const route = useRoute()
const pis = ref(null)
const pis_array1 = ref(null)

async function loadDatabase() {
    try {
        const res1 = await authedFetch('/v2.0/data/dbtables/constituentdatabases?count=false&limit=5000&offset=0', {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res1.ok) {
            throw new Error(res1.statusText)
        }

        const json1 = await res1.json()
        databasekeys.value = json1.data
        currentDB.value = databasekeys.value.find((element) => element.databaseid === Number(route.params.databaseid))
        databasename.value = currentDB.value.databasename

        const res = await authedFetch(`/v2.0/data/datasets/db?limit=10000&offset=0&database=${databasename.value}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            throw new Error(res.statusText)
        }

        const json = await res.json()
        databaseinfo.value = json.data
        pis.value = databaseinfo.value.reduce((acc, obj) => {
            obj.site.datasets.forEach((dataset) => {
                dataset.datasetpi.forEach((pi) => {
                    const type = pi.contactname
                    acc[type] = (acc[type] || 0) + 1
                })
            })
            return acc
        }, {})
        pis_array1.value = Object.entries(pis.value).map(([name, value]) => ({ name, value }))
        pis_array1.value = pis_array1.value.filter((obj) => obj.name !== 'null')
    } catch (err) {
        console.log(err)
    } finally {
        loading_some.value = false
    }
}

onMounted(async () => {
    await loadDatabase()
})

const filteredPIs = computed(() => {
    if (pis_array1.value) {
        return pis_array1.value.filter((car) => {
            return Object.values(car).some((value) =>
                value.toString().toLowerCase().includes(globalFilter.value.toLowerCase())
            )
        })
    } else {
        return []
    }
})
</script>

<template>
    <div v-if="!loading_some">
        <Panel toggleable collapsed>
            <template #header>
                <h3>Datasets by PI</h3>
            </template>
            <DataTable
                v-model="globalFilter"
                :value="filteredPIs"
                paginator
                :rows="5"
                :sort-field="'value'"
                :sort-order="-1"
                tableStyle="min-width: 20rem"
            >
                <template #header>
                    <div class="flex justify-content-end">
                        <InputText v-model="globalFilter" placeholder="Search PIs" />
                    </div>
                </template>
                <Column field="name" header="PI Name" :filter="true">
                    <template #body="{ data }">
                        {{ data.name }}
                    </template>
                </Column>
                <Column field="value" header="Number Datasets Uploaded" sortable></Column>
            </DataTable>
        </Panel>
        <div></div>
    </div>
    <div v-else class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
</template>
