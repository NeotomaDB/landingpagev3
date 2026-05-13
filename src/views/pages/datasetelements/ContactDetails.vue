<script setup>
import { ref, onMounted } from 'vue'
import Badge from 'primevue/badge'
import { authedFetch } from '@/functions/apicalls'

const props = defineProps(['contactid'])
let orcid = ref(null)
let loading = ref(true)
const error = ref(null)

async function load_contact() {
    try {
        const res = await authedFetch(`/v2.0/apps/orcids?contactid=${props.contactid}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            const requestError = new Error(res.statusText)
            requestError.json = res.json()
            orcid.value = false
            throw requestError
        }

        const json = await res.json()
        orcid.value = json.data[0] ? json.data[0].identifier : false
    } catch (err) {
        error.value = err
        orcid.value = false
        if (err.json) {
            const json = await err.json
            error.value.message = json.message
        }
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await load_contact()
})
</script>

<template>
    <div v-if="!loading">
        <div v-if="orcid">
            <a :href="orcid">
                <Badge size="small" value="Orcid" severity="success" />
            </a>
        </div>
        <div v-else>
            <Badge size="small" severity="secondary" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContactDetails',
    data() {
        return {
            msg: 'We have obtained an ORCID.'
        }
    }
}
</script>
