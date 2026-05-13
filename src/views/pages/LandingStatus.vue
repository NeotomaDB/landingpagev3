<script setup>
import ProgressSpinner from 'primevue/progressspinner'
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Badge from 'primevue/badge'

const refs = ref({})

const controller = new AbortController()

async function checkEndpointStatus(key, name, url, mode = 'cors') {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            mode,
            signal: controller.signal
        })

        refs.value[key] = {
            name,
            status: response.ok || response.type === 'opaque',
            url
        }
    } catch (err) {
        refs.value[key] = {
            name,
            status: false,
            url
        }
        console.log(err)
    }
}

async function loadStatus() {
    await Promise.all([
        checkEndpointStatus('apidev', 'Development API', 'https://api-dev.neotomadb.org/api-docs/', 'no-cors'),
        checkEndpointStatus('api', 'Neotoma API', 'https://api.neotomadb.org/api-docs/', 'no-cors'),
        checkEndpointStatus('explorer', 'Neotoma Explorer', 'https://apps.neotomadb.org/explorer', 'no-cors'),
        checkEndpointStatus('tilia', 'Tilia API', 'https://tilia.neotomadb.org/api', 'no-cors')
    ])
}

onMounted(() => {
    loadStatus()
})
</script>

<template>
    <Card header="Neotoma Web Link Status & Reference">
        <template #content>
            <div v-if="Object.keys(refs).sort().join() === ['api', 'apidev', 'explorer', 'tilia'].sort().join()">
                <div class="grid">
                    <div class="col-4 p-3">
                        <div v-for="endpoint in refs" class="row m-1">
                            <a
                                :href="refs.url"
                                class="p-button"
                                style="width: auto; background: #5d584b; display: block"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Badge
                                    v-if="endpoint.status"
                                    severity="success"
                                    style="color: #000000"
                                    class="p-2 mr-5 ml-5"
                                />
                                <Badge v-if="!endpoint.status" severity="danger" class="p-2 mr-5 ml-5" />
                                <strong>{{ endpoint.name }}</strong>
                            </a>
                        </div>
                    </div>

                    <div class="col-4 p-3 align-self-end">
                        <div style="width: 100%; text-align: center">
                            <i class="pi pi-database" style="font-size: 2.5rem; padding: 10px" />
                        </div>
                        <p>
                            The Neotoma Database Schema is a navigable representation of the data tables within the
                            Neotoma Postgres database.
                        </p>
                        <a
                            href="https://open.neotomadb.org/dbschema"
                            class="p-button"
                            target="_blank"
                            style="width: auto; display: block; text-align: center; background: #5d584b"
                            rel="noopener noreferrer"
                            >Database Schema</a
                        >
                    </div>
                    <div class="col-4 p-3 align-self-end">
                        <div style="width: 100%; text-align: center">
                            <i class="pi pi-book" style="font-size: 2.5rem; padding: 10px" />
                        </div>
                        <p>
                            The Neotoma Database Manual provides information about the database, controlled vocabularies
                            and other design decisions.
                        </p>
                        <a
                            href="https://open.neotomadb.org/manual"
                            class="p-button"
                            target="_blank"
                            style="width: auto; display: block; text-align: center; background: #5d584b"
                            rel="noopener noreferrer"
                            >Database Manual</a
                        >
                    </div>
                </div>
            </div>
            <div v-else class="flex flex-wrap justify-content-center align-items-center">
                <ProgressSpinner class="flex-grow-1 w-max" />
            </div>
        </template>
    </Card>
</template>

<script>
export default {
    name: 'DataStatus'
}
</script>
