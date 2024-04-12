<script setup>
import {ref, computed} from 'vue';
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import textobj from '@/views/dbdescrips.json'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext'
import Tooltip from 'primevue/tooltip'
import { getCenter } from 'ol/extent';
//app.directive('tooltip', Tooltip);
const databasekeys = ref(null);
const visible = ref(false);
const tooltipVisible = ref(false);
const contact = ref(0)
const contactinfo = ref(0)
const uniqueSites = ref(null);
const uniqueDBsets = ref(null);
const datasettypes = ref(null);
const thisOneActive = ref(null);
const textDB = ref(null);
const dbkey2 = ref(null);
const htmlString = ref(null);
const name = ref(null);
const globalFilter = ref('')
const typesString = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

function loadDatabases() {
    return  fetch(neotomaapi + "/v2.0/data/dbtables/constituentdatabases?count=false&limit=5000&offset=0",
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      databasekeys.value = json1.data  
      return databasekeys.value
    })
    }




async function loadSumSites(id) {
      if (textobj.filter(a => a.dbID == id.databaseid).length != 0) {
      let texttry = textobj.filter(a => a.dbID == id.databaseid)[0].dbDescrip
      textDB.value = texttry}
      else {
        textDB.value = ""
      }
      htmlString.value = textDB.value
      let itsall = await fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + id.databaseid)
      name.value = id.databasename
      if (id.contactid) {
        let con = await fetch(neotomaapi + "/v1.5/data/contacts/" +id.contactid)
        con = await con.json();
        con = await con.data;
        contact.value = con.flatMap(con => con.contactname);
        contact.value = contact.value[0]}
      else {
        contact.value = "No Contact"
      }

      itsall = await itsall.json()
      itsall = await itsall.data
      let uniques = new Set()
      itsall.forEach(obj => uniques.add(obj['siteid']));
      uniques = uniques.size
      console.log(id.databaseid)
      uniqueSites.value = uniques
      uniqueDBsets.value = new Set();
      itsall.forEach(obj => uniqueDBsets.value.add(obj['datasetid']));
      uniqueDBsets.value = uniqueDBsets.value.size
      datasettypes.value = itsall.reduce((acc, obj) => {
          const type = obj.datasettype;
          acc[type] = (acc[type] || 0) + 1;
          return acc;}, {});

      datasettypes.value = Object.entries(datasettypes.value).map(([datasettype,value]) => ({datasettype,value}));
      datasettypes.value =datasettypes.value.sort((a,b) => b.value - a.value)
      console.log(datasettypes.value)
      typesString.value = datasettypes.value.map(item => `${item.datasettype}: ${item.value}`).join('\n')

  
}


loadDatabases();


const filteredDBs = computed(() => {
  if (databasekeys.value) {
    return databasekeys.value.filter(car => {
      return Object.values(car).some(value => {
        // Check if the value is not null before converting to string
        if (value !== null) {
          return value.toString().toLowerCase().includes(globalFilter.value.toLowerCase());
        }
        return false; // Skip null values
      });
    });
  } else {
    return [];
  }
});

function gotodb(el) {
  let id = el.databaseid
  const url = `https://data.neotomadb.org/database/${id}`
  window.open(url,'_blank');
}



</script>


<template>
    <h1 style="text-align:center;">Constituent Databases</h1>
    <Panel>
    <p style="font-size:20px;">Neotoma is federated: a database of databases. Each constituent database in Neotoma 
      focuses on curating paleoecological data from some particular specification of 
      time, space, and proxy type. For instance, the main focus of the North American Pollen Database
      is on late Quaternary pollen records from North America (as the name suggests!). That said, if you 
      explore the North American Pollen Database, you will notice it also includes 
      records from other continents and concerning other kinds of proxies. 
      These landing pages for Neotoma's constituent databases are meant to facilitate that kind of data exploration. 
      These pages provide database-specific information on dataset types,
    spatial and temporal coverage, upload history, and data contributors. 
    </p>
  </Panel>
    <Panel>
      <template #header>
    <div class="flex justify-content-center">
                <InputText v-model="globalFilter" placeholder="Search Databases" />
        </div>
      </template>
      <div class="flex flex-wrap">
     
     
    <div v-for="(el,index) in filteredDBs" class="col-4">
            <Button 
            style="width:100%;height:100%;justify-content:center;background-color:rgb(232,229,222);border-color:rgb(221,205,188);" class="col" 
            v-tooltip="{ value: String(uniqueDBsets) + ' unique datasets\n' + typesString, showDelay: 750,
          pt: {
            arrow: 
            {
             style: {
                borderColor: 'rgb(108,91,71)'
              }
            },
            text: { //'bg-yellow-900 font-medium'
            style: {
              backgroundColor: 'rgb(108,97,71)',
              width:'250px',
              textAlign: 'center'
            }
          },
          }}" 
            @mouseover="loadSumSites(el)" @click="gotodb(el)">
              <p style="font-size:20px;color:rgb(108,97,71);font-weight:bold;">{{ el.databasename }}</p>
            </Button>
         
          <Dialog v-model:visible="visible"
              modal
              :header = 'name'
              :style="{ width: '50rem' }"
              :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
              <div id="about" v-html="htmlString">
            </div>
        
            <p>Database Contact: {{ contact }}</p>
            <p>{{name}} currently contains {{uniqueSites}} unique sites, associated with {{ uniqueDBsets }}
          unique datasets. See below for a summary of the kinds of datasets {{ name }} contains. </p>

    
           <DataTable paginator :rows="5" :value="datasettypes" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
           <Column field="datasettype" header="Dataset Type"></Column>
           <Column field="value" header="Number" sortable></Column>
         </DataTable>
        </Dialog>
   
  </div>

</div> 
</Panel>
</template>