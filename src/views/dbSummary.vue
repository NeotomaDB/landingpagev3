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
  { value: "Lead 210", clicked: false},
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
  { value: "X-ray fluorescence (XRF)", clicked: false },
  
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
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Canadian Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": []
  },
  {
    "DB": "Marine Dinoflagellates Database",
    "times": ["Quaternary"],
    "marginals": ["Modern (post 1850 AD)"]
  },
  {
    "DB": "French Institute of Pondicherry Palynology and Paleoecology Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": []
  },
  {
    "DB": "European Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "PaleoVertebrates of Latin America",
    "times": ["Quaternary"],
    "marginals": []
  },
  {
    "DB": "Neotoma Testate Amoebae Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": []
  },
  {
    "DB": "St. Croix Watershed Research Station of the Science Museum of Minnesota",
    "times": ["Modern (post 1850 AD)"],
    "marginals": []
  },
  {
    "DB": "Indo-Pacific Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": ["pre-Quaternary"]
  },
  {
    "DB": "Latin American Pollen Database",
    "times": ["Quaternary"],
    "marginals": ["Modern (post 1850 AD)", "pre-Quaternary"]
  },
  {
    "DB": "Academy of Natural Sciences at Drexel University",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": ["pre-Quaternary"]
  },
  {
    "DB": "Diatom Paleolimnology Data Cooperative",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": ["pre-Quaternary"]
  },
  {
    "DB": "North American Non-Marine Ostracode Database Project (NANODe)",
    "times": ["Modern (post 1850 AD)"],
    "marginals": []
  },
  {
    "DB": "Neotoma Ostracode Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Canadian Museum of Nature-Delorme Ostracoda-Surface Samples",
    "times": ["Modern (post 1850 AD)"],
    "marginals": []
  },
  {
    "DB": "Tropical South American Diatom Database",
    "times": ["Modern (post 1850 AD)"],
    "marginals": ["Quaternary"]
  },
  {
    "DB": "Alaskan Archaeofaunas",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": ["pre-Quaternary"]
  },
  {
    "DB": "East Asian Nonmarine Ostracod Database",
    "times": ["Modern (post 1850 AD)"],
    "marginals": []
  },
  {
    "DB": "Alpine Palynological Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": []
  },
  {
    "DB": "North American Pollen Database (NAPD)",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": ["pre-Quaternary"]
  },
  {
    "DB": "North American Plant Macrofossil Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": ["pre-Quaternary"]
  },
  {
    "DB": "FAUNMAP",
    "times": ["Quaternary"],
    "marginals": ["Modern (post 1850 AD)", "pre-Quaternary"]
  },
  {
    "DB": "Pollen Database of Siberia and the Russian Far East",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": ["pre-Quaternary"]
  },
  {
    "DB": "Neotoma",
    "times": [],
    "marginals": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"]
  },
  {
    "DB": "NDSU Insect Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Japanese Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": ["pre-Quaternary"]
  },
  {
    "DB": "Neotoma Midden Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Chinese Pollen Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Holocene Perspective on Peatland Biogeochemistry",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": []
  },
  {
    "DB": "Deep-Time Palynology Database",
    "times": ["pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Neotoma Biomarker Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Faunal Isotope Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Neotoma Charcoal Data",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Pollen Monitoring Programme",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Nonmarine Ostracod Distribution in Europe Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Sedimentary aDNA Database",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "ANTIGUA",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Cooperative Holocene Mapping Project",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": []
  },
  {
    "DB": "SISAL",
    "times": ["Modern (post 1850 AD)", "Quaternary", "pre-Quaternary"],
    "marginals": []
  },
  {
    "DB": "Strategic Environmental Archaeology Database",
    "times": ["Modern (post 1850 AD)", "Quaternary"],
    "marginals": []
  },
  {
    "DB": "MioMap",
    "times": ["pre-Quaternary"],
    "marginals": []
  }
]

const geo_code = [
  {
    "DB": "African Pollen Database",
    "places": ["North Africa", "Sub Saharan Africa"],
    "marg_pl": ["Middle East", "Atlantic Ocean", "Indian Ocean"]
  },
  {
    "DB": "Canadian Pollen Database",
    "places": ["North America"],
    "marg_pl": []
  },
  {
    "DB": "Marine Dinoflagellates Database",
    "places": ["Atlantic Ocean", "Arctic Ocean"],
    "marg_pl": ["Pacific Ocean", "Southern Ocean"]
  },
  {
    "DB": "French Institute of Pondicherry Palynology and Paleoecology Database",
    "places": ["Southeast Asia", "Indian subcontinent"],
    "marg_pl": ["Indian Ocean"]
  },
  {
    "DB": "European Pollen Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Middle East", "Europe"],
    "marg_pl": ["North Africa", "Atlantic Ocean", "Arctic Ocean"]
  },
  {
    "DB": "PaleoVertebrates of Latin America",
    "places": ["North America", "Central America", "South America"],
    "marg_pl": []
  },
  {
    "DB": "Neotoma Testate Amoebae Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania"],
    "marg_pl": []
  },
  {
    "DB": "St. Croix Watershed Research Station of the Science Museum of Minnesota",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Indo-Pacific Pollen Database",
    "places": ["Southeast Asia", "Oceania", "Pacific Ocean", "Indian Ocean"],
    "marg_pl": ["Southern Ocean"]
  },
  {
    "DB": "Latin American Pollen Database",
    "places": ["North America", "Central America", "South America"],
    "marg_pl": []
  },
  {
    "DB": "Academy of Natural Sciences at Drexel University",
    "places": ["Russia", "North America", "South America", "Europe"],
    "marg_pl": ["North Africa", "Sub Saharan Africa", "Central America", "Atlantic Ocean", "Pacific Ocean"]
  },
  {
    "DB": "Diatom Paleolimnology Data Cooperative",
    "places": ["North America"],
    "marg_pl": []
  },
  {
    "DB": "North American Non-Marine Ostracode Database Project (NANODe)",
    "places": ["North America"],
    "marg_pl": []
  },
  {
    "DB": "Neotoma Ostracode Database",
    "places": ["North America"],
    "marg_pl": []
  },
  {
    "DB": "Canadian Museum of Nature-Delorme Ostracoda-Surface Samples",
    "places": ["North America"],
    "marg_pl": []
  },
  {
    "DB": "Tropical South American Diatom Database",
    "places": ["South America"],
    "marg_pl": ["Central America"]
  },
  {
    "DB": "Alaskan Archaeofaunas",
    "places": ["North America", "Pacific Ocean"],
    "marg_pl": ["Arctic Ocean"]
  },
  {
    "DB": "East Asian Nonmarine Ostracod Database",
    "places": ["Eastern Asia"],
    "marg_pl": []
  },
  {
    "DB": "Alpine Palynological Database",
    "places": ["Europe"],
    "marg_pl": ["Russia", "Central Asia", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "South America"]
  },
  {
    "DB": "North American Pollen Database (NAPD)",
    "places": ["North America"],
    "marg_pl": ["Atlantic Ocean", "Pacific Ocean"]
  },
  {
    "DB": "North American Plant Macrofossil Database",
    "places": ["North America"],
    "marg_pl": ["Central America"]
  },
  {
    "DB": "FAUNMAP",
    "places": ["North America"],
    "marg_pl": ["Central America", "Europe"]
  },
  {
    "DB": "Pollen Database of Siberia and the Russian Far East",
    "places": ["Russia", "Central Asia"],
    "marg_pl": []
  },
  {
    "DB": "Neotoma",
    "places": [],
    "marg_pl": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"]
  },
  {
    "DB": "NDSU Insect Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Japanese Pollen Database",
    "places": ["Eastern Asia"],
    "marg_pl": ["Pacific Ocean"]
  },
  {
    "DB": "Neotoma Midden Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Chinese Pollen Database",
    "places": ["Central Asia", "Eastern Asia"],
    "marg_pl": ["Southeast Asia", "Pacific Ocean", "Indian Ocean"]
  },
  {
    "DB": "Holocene Perspective on Peatland Biogeochemistry",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Deep-Time Palynology Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Neotoma Biomarker Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Faunal Isotope Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Neotoma Charcoal Data",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Pollen Monitoring Programme",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Nonmarine Ostracod Distribution in Europe Database",
    "places": ["Europe"],
    "marg_pl": []
  },
  {
    "DB": "Sedimentary aDNA Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "ANTIGUA",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Cooperative Holocene Mapping Project",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "SISAL",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "Strategic Environmental Archaeology Database",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
  },
  {
    "DB": "MioMap",
    "places": ["Russia", "Central Asia", "Eastern Asia", "Southeast Asia", "Indian subcontinent", "Middle East", "North Africa", "Sub Saharan Africa", "North America", "Central America", "South America", "Europe", "Oceania", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Southern Ocean", "Arctic Ocean"],
    "marg_pl": []
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
      location_marg: geoEntry ? geoEntry.marg_pl : null,
      time: timeEntry ? timeEntry.times : null,
      time_marg: timeEntry ? timeEntry.marginals : null,
      locstring: geoEntry ? geoEntry.places.join("\n") : null,
      timestring: timeEntry ? timeEntry.times.join("\n") : null,
      time_margstring: timeEntry && timeEntry.marginals.length ? 
      [...timeEntry.marginals.slice(0,-1), timeEntry.marginals.at(-1) + " (marginal)"].join(" (marginal) \n") 
      : '',
      loc_margstring:  geoEntry && geoEntry.marg_pl.length
  ? [...geoEntry.marg_pl.slice(0, -1), geoEntry.marg_pl.at(-1) + " (marginal)"].join(" (marginal) \n")
  : '',
      marginal_value: false,
      marginal_valuet: false

    };
      
    });
    show.value = true
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

function gotodb(el) {
  window.open("https://data.neotomadb.org/database/" + el.database.databaseid)
}

filteredDBs.value = computed(() => {
  if (!databasekeys.value) return [];

  const filtered = databasekeys.value.filter(car => {
    // Global string match
    const matchString = Object.values(car.database ?? {}).some(value => {
      if (value !== null) {
        return value.toString().toLowerCase().includes(globalFilter.value.toLowerCase());
      }
      return false;
    });

    // Dataset type match
    let matchData = false;
    if (car.datasettypes != null) {
      matchData = Object.values(datafilter.value).every(filter =>
        car.datasettypes.some(dataset =>
          dataset.datasettype !== null && dataset.datasettype.toString() === filter
        )
      );
    } else {
      return false;
    }

    // Region match
    let matchReg = false;
    if (car.location != null) {
      matchReg = Object.values(regionfilter.value).every(filter =>
        car.location.some(loc => loc !== null && loc === filter)
      );
      if (matchReg) car.marginal_value = false;
    }

    if (!matchReg && car.location_marg != null) {
      matchReg = Object.values(regionfilter.value).every(filter =>
        car.location_marg.some(loc => loc !== null && loc === filter)
      );
      if (matchReg) {
        car.marginal_value = true;
        console.log("Matched marginal region: " + car.database.databasename);
      }
    }

    if (!matchReg) return false;

    // Time match
    let matchTime = false;
    if (car.time != null) {
      matchTime = Object.values(timefilter.value).every(filter =>
        car.time.some(tim => tim !== null && tim === filter)
      );
      if (matchTime) car.marginal_valuet = false;
    }

    if (!matchTime && car.time_marg != null) {
      matchTime = Object.values(timefilter.value).every(filter =>
        car.time_marg.some(tim => tim !== null && tim === filter)
      );
      if (matchTime) {
        car.marginal_valuet = true;
        console.log("Matched marginal time");
      }
    }

    if (!matchTime) return false;

    return matchString && matchData && matchReg && matchTime;
  });

  return filtered.slice().sort((a, b) => {
    const priority = (el) => {
      if (el.string !== '' && !el.marginal_value && !el.marginal_valuet) return 0;
      if (el.string !== '' && (el.marginal_value || el.marginal_valuet)) return 1;
      return 2;
    };
    return priority(a) - priority(b);
  });
});

console.log(filteredDBs.value)

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

//const currentYear = 1950 - new Date().getFullYear();
//function gotodb(el) {
//  let id = el.database.databaseid
//  const url = `https://data.neotomadb.org/database/${id}`
//  window.open(url,'_blank');
//}



</script>

<style>

.p-panel-header {
  display: grid !important;
  justify-content:space-evenly !important;
  grid-template-columns: 2fr 3fr 1fr !important;
}
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
  background-color:#837c6c  !important;
  cursor: pointer  !important;
  border: 3px solid #eabf93  !important;
  line-height: 1.5  !important;
  border-collapse:collapse  !important;
}

.clicked {
  background-color:rgb(158, 126, 150) !important;
  cursor: pointer  !important;
  border: 2px solid pink  !important;
  line-height:1.5  !important;
 /* font-weight:bold; */
}

.clicked:hover {
  background-color:rgb(170,110,192) !important;
}

.not:hover {
  background-color:#e4c3a2 !important;
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
      <i class="pi pi-question-circle" style="width:10px;font-size: 1rem; color: rgb(108,97,71);" v-tooltip="{ value: ('Filter Neotoma\'s databases based on dataset type. Databases with a light gray background do not currently curate any data, but they may in the future.'),
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
          }}"></i>
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
      <i class="pi pi-question-circle" style="width:10px;font-size: 1rem; color: rgb(108,97,71);" v-tooltip="{ value: ('Filter Neotoma\'s databases based on temporal range. Databases with a dark gray background curate data from the selected period on the margins. That means the given database will accept data from the selected period only if no other database is more suitable. Databases with a light gray background do not currently curate any data, but they may in the future.'),
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
          }}"></i>
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
      <i class="pi pi-question-circle" style="width:10px;font-size: 1rem; color: rgb(108,97,71);" v-tooltip="{ value: ('Filter Neotoma\'s databases based on region. Databases with a dark gray background curate data from the selected region on the margins. That means the given database will accept data from the selected region only if no other database is more suitable. Databases with a light gray background do not currently curate any data, but they may in the future.'),
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
          }}"></i>
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
      <div class="flex flex-wrap">
     

    <div v-for="(el,index) in filteredDBs.value" class="col-4">
      <div v-if="el.string != '' && el.marginal_value == false && el.marginal_valuet == false" style="height:100%;">
        <Button style="width:100%;height:100%;justify-content:center;background-color:rgb(232,229,222);border-color:rgb(221,205,188);" class="col" 
            v-tooltip="{ value: ('Datasets: \n' + el.string + '\n\n Time: \n' + el.timestring + '\n' + el.time_margstring + '\n\n Regions: \n' + el.locstring  + '\n' + el.loc_margstring),
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
      <div v-if="el.string != '' && (el.marginal_value == true || el.marginal_valuet == true)" style="height:100%;">
        <Button style="width:100%;height:100%;justify-content:center;background-color:rgb(150,150,150);border-color:rgb(221,205,188);" class="col" 
            v-tooltip="{ value: ('Datasets: \n' + el.string + '\n\n Time: \n' + el.timestring +   '\n' + el.time_margstring + '\n\n Regions: \n' + el.locstring + '\n' + el.loc_margstring),
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
  
          <p style="font-size:20px;color:rgb(50,50,30);font-weight:bold;">{{ el.database.databasename }}</p>
        </Button>
      </div>
         <div v-if="el.string == ''" style="height:100%;">
            <Button 
            style="width:100%;height:100%;justify-content:center;background-color:rgb(202,209,202);border-color:rgb(171,170,178);" class="col" 
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
