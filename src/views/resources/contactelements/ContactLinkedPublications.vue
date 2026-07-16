<script setup>
import { onMounted, ref } from 'vue'
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner'
import { useRouter } from 'vue-router'
import { authedFetch } from '@/functions/apicalls'

const router = useRouter()
const props = defineProps(['title'])
const publications = ref([])
const loading = ref(true)
const error = ref(null)

// Prefer the dedicated `doi` field from the API; fall back to parsing the
// citation string (which may carry an inline "[DOI: ...]" suffix).
function getDoi(item) {
    if (item?.doi) {
        return item.doi
    }
    const match = item?.citation?.match(/10\.\d{4,9}\/[^\s\]\)]+/)
    return match ? match[0].replace(/[.,;]+$/, '') : null
}

// The citation often ends with a redundant "[DOI: ...]" chunk; strip it so the
// DOI is only shown once, as its own bold line.
function displayCitation(item) {
    return item?.citation?.replace(/\s*\[DOI:[^\]]*\]\s*$/i, '').trim() ?? ''
}

// Split the citation into a bold "head" (authors up to and including the year)
// and the remaining "tail" (title, journal, etc.) to improve readability.
function citationParts(item) {
    const citation = displayCitation(item)
    const year = item?.year ? String(item.year) : null
    if (year) {
        const idx = citation.indexOf(year)
        if (idx !== -1) {
            let boundary = idx + year.length
            if (citation[boundary] === '.') {
                boundary++
            }
            return { head: citation.slice(0, boundary), tail: citation.slice(boundary) }
        }
    }
    return { head: '', tail: citation }
}

async function get_contactpubs(contactid) {
    try {
        const res = await authedFetch(`/v2.0/data/contacts/${contactid}/publications`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            const requestError = new Error(res.statusText)
            requestError.json = res.json()
            throw requestError
        }

        const json = await res.json()
        publications.value = json.data
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
    await router.isReady()
    await get_contactpubs(props.title)
})
</script>

<template>
    <div v-if="loading">
        <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <div v-else-if="publications.length">
        <Panel>
            <template #header>
                <h4>User Publications</h4>
            </template>
            <div v-for="item in publications" :key="item.publicationid" class="pub-entry">
                <span><strong>{{ citationParts(item).head }}</strong>{{ citationParts(item).tail }}</span>
                <div v-if="getDoi(item)">
                    <strong>DOI:</strong>&nbsp;<a :href="`https://doi.org/${getDoi(item)}`" target="_blank"
                        >https://doi.org/{{ getDoi(item) }}</a
                    >
                </div>
            </div>
        </Panel>
    </div>
    <div v-else></div>
</template>

<script>
export default {
    name: 'ContactPublications',
    data() {
        return {
            msg: 'We have rendered the publications for the author.'
        }
    }
}
</script>

<style scoped>
.pub-entry {
    line-height: 1.5;
    margin-bottom: 1.25rem;
}
</style>
