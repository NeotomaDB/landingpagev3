<script setup>
import {ref, computed, watch, shallowReactive} from 'vue';
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
//import textobj from '@/views/dbdescrips.json'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext'
import Slider from 'primevue/slider'

import Badge from 'primevue/badge';

const min = -469897000
const logmin = ref("-50,000")
const logmax =  ref("50,000,000")
const logmin_num = ref(-50000)
const logmax_num = ref(50000000)
const max = 769897000
const slide = ref([min,max]);
const databasekeys = ref(null);
const show = ref(false);
const dbsums = ref(null);
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
    .then(val => {
      return  fetch(neotomaapi + "/v2.0/apps/constdb/",
      { method: "GET", headers: {'content-type': 'application/json'}})
    })
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      dbsums.value = json1.data  
      return dbsums.value
    })
    .then(db => {
      databasekeys.value = databasekeys.value.map(item1 => {
        const matchingItem = db.find(item2 => item1['databasename'] === item2['databasename']);
        return matchingItem ? { ...item1, ...matchingItem } : item1;
    }).concat(db.filter(item2 => !databasekeys.value.some(item1 => item1['databasename'] === item2['databasename'])))
    databasekeys.value.string = databasekeys.value.map(el => {
      el.datasettypes.join('/n')
    })
    databasekeys.value = databasekeys.value.map(obj => ({
      ...obj,
      string: obj['datasettypes'].join('\n')
    }));
    show.value = true
    })

    }







loadDatabases();

function buttonfilter(dtype) {
  const index = datafilter.value.indexOf(dtype.value);
  dtype.clicked = !dtype.clicked;
  if (index === -1) {
    datafilter.value.push(dtype.value)
  } else {
    datafilter.value.splice(index, 1)}
}




filteredDBs.value = computed(() => {
  if (databasekeys.value) {

    return databasekeys.value.filter(car => {
      const matchString = Object.values(car).some(value => {
        // Check if the value is not null before converting to string
        if (value !== null) {
          let a = value.toString().toLowerCase().includes(globalFilter.value.toLowerCase());
         // let b = value.toString().toLowerCase().includes(Object.values(datafilter.value))
          return a
        }
        return false; // Skip null values
      });

      var matchData = false;
if (car.datasettypes != null) {
    matchData = Object.values(datafilter.value).every(filter => {
        return Object.values(car.datasettypes).some(value => {
            if (value !== null) {
                return value.toString() === filter;
            }
            return false;
        });
    });
} else {
    return false;
}


      var timeMatch = false
      if (car.younger != null && car.older != null) {
      if ((car.younger <= logmax_num.value && car.younger >= logmin_num.value) || 
      (car.older >= logmin_num.value && car.older <= logmax_num.value) || (car.younger <= logmin_num.value && car.older >= logmax_num.value) ) {
        timeMatch = true;
      }}

      if (car.younger == null && car.older == null) {
        timeMatch = true;
      }
      return matchString && matchData && timeMatch
    });
  } else {
    return [];
  }
});

function addCommasToNumber(number) {
    // Convert the number to a string
    let str = number.toString();
    
    // Insert commas every three characters from the end of the string
    let result = '';
    let count = 0;
    if (str[0] == "-") {
    for (let i = str.length - 1; i >= 0; i--) {
        result = str[i] + result;
        count++;
        if (count % 3 === 0 && i !== 0 && i !== 1) {
            result = ',' + result;
        }
    }
  }
    else {
    for (let i = str.length - 1; i >= 0; i--) {
        result = str[i] + result;
        count++;
        if (count % 3 === 0 && i !== 0) {
            result = ',' + result;
        }
    }}
    
    return result;
}


function gotodb(el) {
  let id = el.databaseid
  const url = `https://data.neotomadb.org/database/${id}`
  window.open(url,'_blank');
}

watch([logmin_num,logmax_num], () => {
  logmin.value = addCommasToNumber(logmin_num.value)
  logmax.value = addCommasToNumber(logmax_num.value)
if (logmin_num.value > 0) {
  slide.value[0] = 99999999.9*Math.log10(logmin_num.value)

}

if (logmin_num.value < 0) {
  slide.value[0] = -99999999.9*Math.log10(0-logmin_num.value)

}

if (logmax_num.value > 0) {
  slide.value[1] = 99999999.9*Math.log10(logmax_num.value)
}


if (logmax_num.value < 0) {
  slide.value[1] = -99999999.9*Math.log10(0-logmax_num.value)
}

if (logmax_num.value == 0) {
  slide.value[1] = 0.01
}

if (logmin_num.value == 0) {
  slide.value[0] = 0.01
}
})


watch(slide, () => {
  if (slide.value[0] <= 0) {
  logmin_num.value = 0- Math.round(Math.pow(10, 0 -slide.value[0] / 99999999.9))
 logmin.value = addCommasToNumber(logmin_num.value)


}

if (slide.value[1] <= 0) {
  logmax_num.value = 0- Math.round(Math.pow(10, 0 -slide.value[1] / 99999999.9))
 logmax.value = addCommasToNumber(logmax_num.value)
}

if (slide.value[0] > 0) {
  logmin_num.value = Math.round(Math.pow(10,  slide.value[0] / 99999999.9))
  logmin.value = addCommasToNumber(logmin_num.value)
}

if (slide.value[1] > 0) {
  logmax_num.value = Math.round(Math.pow(10,  slide.value[1] / 99999999.9))
  logmax.value = addCommasToNumber(logmax_num.value)
}
})

</script>

<style>
:root {
  --vw: 10px;
}
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

.clicked:hover {
  background-color:rgb(170,110,192);
}

.not:hover {
  background-color:#e4c3a2;
}


.p-slider {
  background: rgb(258, 201, 152);
  height: 10px;
  align-self:center;
  justify-self:center;
  justify-content:center;
  justify-items:center;
  text-align:center;
  margin-left:auto;
  margin-right:auto;
}

.p-slider .p-slider-range {
  background: rgb(198, 161, 132);
}

.p-slider .p-slider-handle {
 border: 2px solid rgb(198, 161, 132);
 top: 0px;
 height: 20px;
 width: 20px;
}

.p-slider:not(.p-disabled) .p-slider-handle:hover {
  background: rgb(198,161,132);
  border-color: #eabf93
}

.p-slider .p-slider-handle:focus {
 box-shadow: 0 0 0 0.2rem #eabf93
}
</style>


<template> 


    <Panel toggleable>
      <template #header>
        <h1 style="text-align:center;">Constituent Databases</h1>
      </template>
    <p style="font-size:20px;">Neotoma is a database of databases. Each constituent database in Neotoma 
      specializes in the curation of paleoecological data from some particular configuration of 
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
      Neotoma's users. 
      These pages provide database-specific information on dataset types,
    spatial and temporal coverage, upload history, and data contributors. 
    </p>
    <p style="font-size:20px;"> On this page, you may filter by database name and dataset types to find Neotoma constituent databases that may be of interest to you. 
      To explore any database in more detail, simply click its button below.
    </p>
  </Panel>
  <Panel toggleable collapsed>
    <template #header>
      <h2>Time Filter</h2>
    </template>
    <Slider v-model="slide" range class="w-100rem" :min='min' :max='max'/>
    <br>
    <div style="max-width:580px;margin-left:auto;margin-right:auto;">
<span>Younger Age: <InputText v-model.number="logmin_num" style="max-width:100px;"/> ({{ logmin }}). 
   Older Age: <InputText  style="max-width:120px;" 
   v-model.number="logmax_num" /> ({{ logmax }}). </span>
</div>
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
            v-tooltip="{ value: ('Number of datasets: ' + el.datasets + '\n Types:\n' + el.string + '\nage range: ' + el.younger + ' to ' + el.older),
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
            @click="gotodb(el)">
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