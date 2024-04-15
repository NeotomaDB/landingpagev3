<script setup>
import {ref, computed} from 'vue';
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import textobj from '@/views/dbdescrips.json'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext'

import Badge from 'primevue/badge';

const databasekeys = ref(null);
const visible = ref(false);
const contact = ref(0)
const uniqueSites = ref(null);
const uniqueDBsets = ref(null);
const datasettypes = ref(null);
const textDB = ref(null);
const htmlString = ref(null);
const name = ref(null);
const globalFilter = ref('')
const typesString = ref(null);
const datafilter = ref([]);
const filteredDBs = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
const datasettypes_master = ref([
  { value: "biochemistry", clicked: false },
  { value: "biomarker", clicked: false },
  { value: "charcoal", clicked: false },
  { value: "charcoal surface sample", clicked: false },
  { value: "chironomid", clicked: false },
  { value: "cladocera", clicked: false },
  { value: "diatom", clicked: false },
  { value: "diatom bottom sample", clicked: false },
  { value: "diatom surface sample", clicked: false },
  { value: "diatom top-bottom", clicked: false },
  { value: "dinoflagellates", clicked: false },
  { value: "energy dispersive X-ray spectroscopy (EDS/EDX)", clicked: false },
  { value: "geochemistry", clicked: false },
  { value: "geochronologic", clicked: false },
  { value: "insect", clicked: false },
  { value: "insect modern", clicked: false },
  { value: "loss-on-ignition", clicked: false },
  { value: "macrocharcoal", clicked: false },
  { value: "macroinvertebrate", clicked: false },
  { value: "Metabarcoding aeDNA", clicked: false },
  { value: "microcharcoal", clicked: false },
  { value: "modern biochemistry", clicked: false },
  { value: "organic carbon", clicked: false },
  { value: "ostracode", clicked: false },
  { value: "ostracode surface sample", clicked: false },
  { value: "paleomagnetic", clicked: false },
  { value: "physical sedimentology", clicked: false },
  { value: "phytolith", clicked: false },
  { value: "plant macrofossil", clicked: false },
  { value: "pollen", clicked: false },
  { value: "pollen surface sample", clicked: false },
  { value: "pollen trap", clicked: false },
  { value: "specimen stable isotope", clicked: false },
  { value: "stable isotope", clicked: false },
  { value: "testate amoebae", clicked: false },
  { value: "testate amoebae surface sample", clicked: false },
  { value: "vertebrate fauna", clicked: false },
  { value: "water chemistry", clicked: false },
  { value: "X-ray diffraction (XRD)", clicked: false },
  { value: "X-ray fluorescence (XRF)", clicked: false }
]);

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
   //   console.log(id.databaseid)
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
   //   console.log(datasettypes.value)
      typesString.value = datasettypes.value.map(item => `${item.datasettype}: ${item.value}`).join('\n')

  
}


loadDatabases();

function buttonfilter(dtype) {
  const index = datafilter.value.indexOf(dtype.value);
  dtype.clicked = !dtype.clicked;
  console.log(dtype)
  if (index === -1) {
    datafilter.value.push(dtype.value)
    console.log(datafilter.value);
  } else {
    datafilter.value.splice(index, 1)
  console.log(datafilter.value)}
}




filteredDBs.value = computed(() => {
  if (databasekeys.value) {
    console.log(globalFilter.value)
    return databasekeys.value.filter(car => {
      const matchString = Object.values(car).some(value => {
        // Check if the value is not null before converting to string
        if (value !== null) {
          console.log("here")
          let a = value.toString().toLowerCase().includes(globalFilter.value.toLowerCase());
         // let b = value.toString().toLowerCase().includes(Object.values(datafilter.value))
          return a
        }
        return false; // Skip null values
      });


      const someValueIncludesAll = Object.values(car).some(value => {
        if (value!== null) {

        return Object.values(datafilter.value).every(filter => value.toString().toLowerCase().includes(filter));}
        return false;
  });

      return matchString && someValueIncludesAll
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

<style>
.not {
  background-color:#837c6c;
  cursor: pointer;
  border: 3px solid #eabf93;
  line-height: 1.5;
  border-collapse:collapse;
}

.clicked {
  background-color:rgb(158, 126, 150);
  cursor: pointer;
  border: 2px solid pink;
  line-height:1.5
 /* font-weight:bold; */
}
</style>


<template> 
    <Panel toggleable>
      <template #header>
        <h1 style="text-align:center;">Constituent Databases</h1>
      </template>
    <p style="font-size:20px;">Neotoma is a database of databases. Each constituent database in Neotoma 
      specializes in the curation of paleoecological data from some particular specification of 
      time, space, and proxy type. For instance, the main focus of the North American Pollen Database
      is on late Quaternary pollen records from North America (as the name suggests!). 
    </p>
     <p style="font-size:20px;"> Although Neotoma's constituent databases specialize in particular kinds of paleo data, 
      they tend over the years to have accumulated other data which arguably fall outside their ambit. 
      (If you explore the North American Pollen Database, you will notice it also includes 
      records from other continents and concerning a variety of proxies.) 
      The landing pages for Neotoma's constituent databases (linked to below) are meant to 
      facilitate data exploration by constituent database, in order to make the 
      sometimes unexpected holdings of any given database more transparent to 
      Neotoma's public. 
      These pages provide database-specific information on dataset types,
    spatial and temporal coverage, upload history, and data contributors. 
    </p>
    <p style="font-size:20px;"> On this page, you may filter by database name and dataset types to find Neotoma constituent databases that may be of interest to you. 
      To explore any database in more detail, simply click its button below.
    </p>
  </Panel>
  <Panel toggleable collapsed>
    <template #header>
      <h2>Dataset Type Filter</h2>
    </template>
    <div style="display:flex;flex-wrap:wrap;">
  <div v-for="el in datasettypes_master" >
  <Badge :class="{ 'clicked': el.clicked, 'not': !el.clicked }" @click="buttonfilter(el)" :value='el.value'></Badge>
</div>
</div>
  </Panel>
    <Panel>
      <template #header>
    <div class="flex justify-content-center">
                <InputText v-model="globalFilter" placeholder="Search Databases" />
        </div>
      </template>
      <div class="flex flex-wrap">
     
     
    <div v-for="(el,index) in filteredDBs.value" class="col-4">
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