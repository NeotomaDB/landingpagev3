<script setup>
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import { authedFetch } from '@/functions/apicalls'

const globalFilter = ref('')
const filtered = ref(null)
const tabledat = ref(null)
const ready = ref(false)
const processing = ref(false)
const value = ref('')

function getInstitution(address) {
    if (!address) return ''
    const normalizedAddress = address.replace(/\s+/g, ' ').trim()
    const streetAddressStart = normalizedAddress.search(/\b(?:\d+[A-Za-z-]*|P\.?\s*O\.?\s*Box)\b/i)
    if (streetAddressStart === -1) return normalizedAddress
    return normalizedAddress.slice(0, streetAddressStart).trim().replace(/[,\s]+$/, '')
}

async function findContacts(contactval) {
    try {
        contactval = contactval.replace(/[^a-zA-Z0-9\s]/g, '%')
        const pattern = new RegExp(contactval.replace(/%/g, '.*'), 'i')
        ready.value = false
        processing.value = true
        const res = await authedFetch('/v2.0/data/dbtables?table=contacts&count=false&limit=10000', {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        const json = await res.json()
        const contacts = json.data ?? []
        filtered.value = contacts.filter((obj) => pattern.test(obj.contactname))

        tabledat.value = filtered.value.map((obj) => ({
            ...obj,
            institution: getInstitution(obj.address),
            link: `/users/${obj.contactid}`
        }))
        ready.value = true
        processing.value = false
    } catch (err) {
        console.log(err)
        processing.value = false
    }
}

const filteredtabledat = computed(() => {
    if (tabledat.value) {
        return tabledat.value.filter((row) =>
            Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(globalFilter.value.toLowerCase())
            )
        )
    } else {
        return []
    }
})
</script>

<template>
    <InputText type="text" v-model="value" placeholder="Search by name..." />
    <Button @click="findContacts(value)" aria-label="Search Contacts">Search</Button>
    <div v-if="!ready && processing">
        <ProgressSpinner style="display: grid; justify-self: center" />
    </div>
    <div v-if="ready && !processing">
        <DataTable
            paginator
            :rows="5"
            :value="filteredtabledat"
            :sort-field="'contactname'"
            :sort-order="1"
            tableStyle="min-width: 50rem"
        >
            <template #header>
                <div class="flex justify-content-end">
                    <InputText v-model="globalFilter" placeholder="Search Table" />
                </div>
            </template>
            <Column field="contactname" header="Name"></Column>
            <Column field="institution" header="Institution"></Column>
            <Column header="Link">
                <template #body="slotProps">
                    <a :href="slotProps.data.link">View Contact</a>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
