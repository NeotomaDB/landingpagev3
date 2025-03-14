<script setup>
import {ref, computed, watch, shallowReactive} from 'vue';
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
//import textobj from '@/views/dbdescrips.json'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Slider from 'primevue/slider';
import ProgressSpinner from 'primevue/progressspinner';

import Badge from 'primevue/badge';

const slide = ref([(1950 - new Date().getFullYear()),50000000]);

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
const regionfilter = ref([]);
const timefilter = ref([]);
const filteredDBs = ref(null);
const loaded = ref(false);
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

const regions_master = ref([
  { value: "Russia", clicked: false, cont: "Asia" },
  { value: "Central Asia", clicked: false, cont: "Asia" },
  { value: "Eastern Asia", clicked: false, cont: "Asia" },
  { value: "Southeast Asia", clicked: false, cont: "Asia" },
  { value: "Indian subcontinent", clicked: false, cont: "Asia" },
  { value: "Middle East", clicked: false, cont: "Asia" },
  { value: "North Africa", clicked: false, cont: "Africa" },
  { value: "Sub-Saharan Africa", clicked: false, cont: "Africa" },
  { value: "North America", clicked: false, cont: "North America"},
  { value: "Central America", clicked: false, cont: "North America" },
  { value: "South America", clicked: false, cont: "Np" },
  { value: "Europe", clicked: false, cont: "Np" },
  { value: "Oceania", clicked: false, cont: "Np" },
  { value: "Atlantic Ocean", clicked: false, cont: "Oceans" },
  { value: "Pacific Ocean", clicked: false, cont: "Oceans" },
  { value: "Indian Ocean", clicked: false, cont: "Oceans" },
  { value: "Southern Ocean", clicked: false, cont: "Oceans" },
  { value: "Arctic Ocean", clicked: false, cont: "Oceans" }
]);
const groupedRegions = regions_master.value.reduce((acc, region) => {
  // If the continent doesn't exist in the accumulator, create it
  if (!acc[region.cont]) {
    acc[region.cont] = [];
  }
  // Push the region into the correct continent array
  acc[region.cont].push(region);

  return acc;
}, {});

// Sort the continents (keys) alphabetically and transform into the desired structure
const sortedGroupedRegions = Object.keys(groupedRegions)
  .sort((a, b) => a.localeCompare(b)) // Sort the continent names alphabetically
  .map(continent => {
    return {
      continent: continent, // Add the 'continent' key with the continent name as value
      regions: groupedRegions[continent].sort((a, b) => a.value.localeCompare(b.value)) // Sort regions alphabetically by value
    };
  });

console.log(sortedGroupedRegions);


const time_master = ref([
  { value: "Modern (post 1850 AD)", clicked: false },
  { value: "Quaternary", clicked: false },
  { value: "pre-Quaternary", clicked: false }
]);

const temp_code = [
  {
    "DB": "African Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "Canadian Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"]
  },
  {
    "DB": "Marine Dinoflagellates Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"]
  },
  {
    "DB": "French Institute of Pondicherry Palynology and Paleoecology Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"]
  },
  {
    "DB": "European Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "PaleoVertebrates of Latin America",
    "times": ["Quaternary"]
  },
  {
    "DB": "Neotoma Testate Amoebae Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"]
  },
  {
    "DB": "St. Croix Watershed Research Station of the Science Museum of Minnesota",
    "times": ["Modern (post 1850 AD)", "Quaternary"]
  },
  {
    "DB": "Indo-Pacific Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "Latin American Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "Academy of Natural Sciences of Drexel University",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "Diatom Paleolimnology Data Cooperative (DPDC)",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "North American Non-Marine Ostracode Database Project (NANODe)",
    "times": ["Modern (post 1850 AD)"]
  },
  {
    "DB": "Neotoma Ostracode Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "Canadian Museum of Nature-Delorme Ostracoda-Surface Samples",
    "times": ["Modern (post 1850 AD)"]
  },
  {
    "DB": "Tropical South American Diatom Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"]
  },
  {
    "DB": "Alaskan Archaeofaunas",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "East Asian Nonmarine Ostracod Database",
    "times": ["Modern (post 1850 AD)"]
  },
  {
    "DB": "Alpine Palynological Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"]
  },
  {
    "DB": "North American Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "North American Plant Macrofossil Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  }
]

const geo_code = [
  {
    "DB": "African Pollen Database",
    "places": ["Middle East", "North Africa", "Sub Saharan Africa", "Atlantic Ocean", "Indian Ocean"]
  },
  {
    "DB": "Canadian Pollen Database",
    "places": ["North America"]
  },
  {
    "DB": "Marine Dinoflagellates Database",
    "places": ["Atlantic Ocean", "Pacific Ocean", "Southern Ocean", "Arctic Ocean"]
  },
  {
    "DB": "French Institute of Pondicherry Palynology and Paleoecology Database",
    "places": ["Southeast Asia", "Indian subcontinent", "Indian Ocean"]
  },
  {
    "DB": "European Pollen Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Middle East", "North Africa", "Europe", "Atlantic Ocean", "Arctic Ocean"]
  },
  {
    "DB": "PaleoVertebrates of Latin America",
    "places": ["North America", "Central America", "South America"]
  },
  {
    "DB": "Neotoma Testate Amoebae Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania"]
  },
  {
    "DB": "St. Croix Watershed Research Station of the Science Museum of Minnesota",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"]
  },
  {
    "DB": "Indo-Pacific Pollen Database",
    "places": ["Southeast Asia", "Oceania", "Pacific Ocean", "Indian Ocean", "Southern Ocean"]
  },
  {
    "DB": "Latin American Pollen Database",
    "places": ["North America", "Central America", "South America"]
  },
  {
    "DB": "Academy of Natural Sciences of Drexel University",
    "places": ["Russia", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Atlantic Ocean", "Pacific Ocean"]
  },
  {
    "DB": "Diatom Paleolimnology Data Cooperative (DPDC)",
    "places": ["North America"]
  },
  {
    "DB": "North American Non-Marine Ostracode Database Project (NANODe)",
    "places": ["North America"]
  },
  {
    "DB": "Neotoma Ostracode Database",
    "places": ["North America"]
  },
  {
    "DB": "Canadian Museum of Nature-Delorme Ostracoda-Surface Samples",
    "places": ["North America"]
  },
  {
    "DB": "Tropical South American Diatom Database",
    "places": ["Central America", "South America"]
  },
  {
    "DB": "Alaskan Archaeofaunas",
    "places": ["North America", "Pacific Ocean", "Arctic Ocean"]
  },
  {
    "DB": "East Asian Nonmarine Ostracod Database",
    "places": ["Eastern Asia"]
  },
  {
    "DB": "Alpine Palynological Database",
    "places": ["Russia", "Central Asia", "Middle East", "North Africa", "North America", "Central America", "South America", "Europe"]
  },
  {
    "DB": "North American Pollen Database",
    "places": ["North America", "Atlantic Ocean", "Pacific Ocean"]
  },
  {
    "DB": "North American Plant Macrofossil Database",
    "places": ["North America", "Central America"]
  }
]




    function loadDatabases() {
      return  fetch(neotomaapi + "/v2.0/apps/constdb/",
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      dbsums.value = json1.data 
      return dbsums.value
    })
    .then(db => {
    databasekeys.value = db.map(obj => {
      const geoEntry = geo_code.find(geo => 
      geo.DB === obj.database.databasename);
      const timeEntry = temp_code.find(time => 
      time.DB === obj.database.databasename);


      return {
      ...obj,
      string: obj.datasettypes
      .map(type => type.datasettype)
      .filter(Boolean)
      .join("\n"),
      location: geoEntry ? geoEntry.places : null,
      time: timeEntry ? timeEntry.times : null,
      locstring: geoEntry ? geoEntry.places.join("\n") : null,
      timestring: timeEntry ? timeEntry.times.join("\n") : null,

    };
      
    });
    show.value = true;
    loaded.value = true;
    console.log(databasekeys.value)
    })
    .catch(err => {
      console.log(err)
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

function buttonfilterreg(reg) {
  const index = regionfilter.value.indexOf(reg.value);
  reg.clicked = !reg.clicked;
  if (index === -1) {
    regionfilter.value.push(reg.value)
  } else {
    regionfilter.value.splice(index, 1)}
}

function buttonfiltertime(time) {
  const index = timefilter.value.indexOf(time.value);
  time.clicked = !time.clicked;
  if (index === -1) {
    timefilter.value.push(time.value)
  } else {
    timefilter.value.splice(index, 1)}
}



filteredDBs.value = computed(() => {
  if (databasekeys.value) {

    return databasekeys.value.filter(car => {
      const matchString = Object.values(car.database).some(value => {
        // Check if the value is not null before converting to string
        if (value == car.database.databasename) {
          let a = value.toString().toLowerCase().includes(globalFilter.value.toLowerCase());
         // let b = value.toString().toLowerCase().includes(Object.values(datafilter.value))

          return a
        }
        return false; // Skip null values
      });

      var matchData = false;
if (car.datasettypes != null) {
    matchData = Object.values(datafilter.value).every(filter => {
  return car.datasettypes.some(dataset => {
    return dataset.datasettype !== null && dataset.datasettype.toString() === filter;
  });  
 
  
  });
} else {
    return false;
}

var matchReg = false;
if (car.location == null) {
  matchReg = true;
} else if (car.location!= null) {
    matchReg = Object.values(regionfilter.value).every(filter => {
  return car.location.some(loc => {
    return loc !== null && loc === filter;
  });  
});  
} else {
    return false;
}

var matchTime = false;
if (car.time == null) {
  matchTime = true;
} else if (car.time!= null) {
    matchTime = Object.values(timefilter.value).every(filter => {
  return car.time.some(tim => {
    return tim !== null && tim === filter;
  });  
});  
} else {
    return false;
}
      return matchString && matchData && matchReg && matchTime
    });
  } else {
    return [];
  }
});


console.log(filteredDBs.value)



</script>

<style>

.placer {
  justify-items:center;
  justify-content:center;
  justify-self:center;
}

.bigplace {
  
  justify-items:center;
  justify-content:center;
  justify-self:center;

}
:root {
  --vw: 10px;
}
.not {
  background-color:#837c6c !important;
  cursor: pointer !important;
  border: 3px solid #eabf93 !important;
  line-height: 1.5 !important;
  border-collapse:collapse !important;
}

.clicked {
  background-color:rgb(158, 126, 150) !important;
  cursor: pointer !important;
  border: 2px solid pink !important;
  line-height:1.5 !important;
 /* font-weight:bold; */
}

.clicked:hover {
  background-color:rgb(170,110,192) !important;
}

.not:hover {
  background-color:#e4c3a2 !important;
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
      The landing pages for Neotoma's constituent databases (linked below) are meant to 
      facilitate data exploration by constituent database, in order to make the 
      sometimes unexpected holdings of any given database more transparent to 
      Neotoma's users. 
      These pages provide database-specific information on dataset types,
    spatial and temporal coverage, upload history, and data contributors. 
    </p>
    <p style="font-size:20px;"> On this page, you may filter by database name, dataset type, and temporal coverage, to find Neotoma constituent databases that may be of interest to you. 
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

  <Panel toggleable collapsed>
    <template #header>
      <h2>Time Filter</h2>
    </template>
    <div style="display:flex;flex-wrap:wrap;">
  <div v-for="el in time_master" >
  <Badge :class="{ 'clicked': el.clicked, 'not': !el.clicked }" @click="buttonfiltertime(el)" :value='el.value'></Badge>
</div>
</div>
  </Panel>


  <Panel toggleable collapsed>
    <template #header>
      <h2>Region Filter</h2>
    </template>
    <div style="display:flex;flex-wrap:wrap;justify-content:space-evenly;">
  <div v-for="el in sortedGroupedRegions " >
    <div  class="bigplace" v-if="el.continent != 'Np'">
      <h3>{{el.continent}}</h3>
        <div class="placer" v-for="pla in el.regions">
          <Badge 
            :class="{ 'clicked': pla.clicked, 'not': !pla.clicked }" 
            @click="buttonfilterreg(pla)" :value='pla.value'></Badge>
        </div>
    </div>
    <div class="bigplace" v-else>
      <h3>Other Continents</h3>
      <div class="placer" v-for="pla in el.regions">
          <Badge 
            :class="{ 'clicked': pla.clicked, 'not': !pla.clicked }" 
            @click="buttonfilterreg(pla)" :value='pla.value'></Badge>
        </div>
    </div>
  </div>
</div>
  </Panel>
    <Panel>
      <template #header>
    <div class="flex justify-content-center">
                <InputText v-model="globalFilter" placeholder="Search Databases" />
        </div>
      </template>
      <div v-if="!loaded" style="justify-content:center;justify-self:center;justify-items:center;">
      <ProgressSpinner />
    </div>
      <div class="flex flex-wrap">
    <div v-for="(el,index) in filteredDBs.value" class="col-4">
      <div v-if="el.string != ''" style="height:100%;">
        <Button style="width:100%;height:100%;justify-content:center;background-color:rgb(232,229,222);border-color:rgb(221,205,188);" class="col" 
            v-tooltip="{ value: ('Datasets: \n' + el.string + '\n\n Time: \n' + el.timestring + '\n\n Regions: \n' + el.locstring),
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
  
          <p style="font-size:20px;color:rgb(108,97,71);font-weight:bold;">{{ el.database.databasename }}</p>
        </Button>
      </div>
      <div v-if="el.string == ''" style="height:100%;">
        <Button style="width:100%;height:100%;justify-content:center;background-color:rgb(202,209,202);border-color:rgb(171,170,178);" class="col" 
          v-tooltip="{ value: ('no datasets yet'),
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
          <p style="font-size:20px;color:rgb(150,157,151);font-weight:bold;">{{ el.database.databasename }}</p>
        </Button>
      </div>
    </div>


</div> 
</Panel>
</template>