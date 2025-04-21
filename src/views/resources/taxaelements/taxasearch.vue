<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';

const globalFilter = ref('');
const filtered = ref(null);
const tabledat = ref(null);
const ready = ref(false);
const processing = ref(false);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org';
const value = ref('');



async function findTaxa(taxonval) {
  try {
    taxonval = taxonval.replace(/[^a-zA-Z0-9]/g, "%");
    const pattern = new RegExp(taxonval.replace(/%/g, ".*"), "i");
    console.log(pattern);
    ready.value = false;
    processing.value = true;
    const res1 = await fetch(neotomaapi + "/v2.0/data/dbtables?table=taxa&count=false&limit=60000", {
      method: "GET",
      headers: { 'content-type': 'application/json' }
    });

    const json1 = await res1.json();
    const taxa = json1.data ?? {};
    filtered.value = taxa.filter(obj =>
    pattern.test(obj.taxonname)   
);

console.log(filtered);

tabledat.value = filtered.value.map(obj => ({
  ...obj,
  link: `https://data.neotomadb.org/taxa/${obj.taxonid}`
}));
    ready.value =true;
    processing.value = false;
  } catch (err) {
    console.log(err);
    return {};
  }
}


const filteredtabledat = computed(() => {
  if (tabledat.value) {

    return tabledat.value.filter(car => {
      return Object.values(car).some(value =>
        value?.toString().toLowerCase().includes(globalFilter.value.toLowerCase())
      );
    });
  } else {
    return [];
  }
});
</script>

<template>
    <InputText type="text" v-model="value" />
    <Button @click='findTaxa(value)'>Search</Button>
    <div v-if="!ready && processing">
      <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <div v-else>
        <DataTable  paginator :rows="5" :value="filteredtabledat" :sort-field="'taxonname'" :sort-order="-1" tableStyle="min-width: 50rem">
            <template #header>
        <div class="flex justify-content-end">
                <InputText v-model="globalFilter" placeholder="Search Table" />
        </div>
      </template>
        <Column field="taxonname" header="Taxon Name"></Column>
        <Column header="Link">
          <template #body="slotProps">
              <a :href="slotProps.data.link" target="_blank">
                  View Taxon
              </a>
          </template>
        </Column>
      </DataTable>
    </div>

</template>