<script setup>
 import { ref, onMounted, computed, watch } from 'vue';
 import CascadeSelect from 'primevue/cascadeselect';
 import Panel from 'primevue/panel'
 import Checkbox from 'primevue/checkbox';
 import DatabaseMap2 from '@/views/resources/databaseelements/DatabaseMap2.vue'
 import { useRoute } from 'vue-router';

 import 'primevue/resources/themes/saga-blue/theme.css'; // Theme
 import 'primevue/resources/primevue.min.css'; // Core styles
 import 'primeicons/primeicons.css'; // Icons
 const route = useRoute()
 const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
 const selectedCountry = ref(null);
 const selecteddata = ref(null);
 const selectedenv = ref(null);
 const selectedtimes = ref(null);
 const recArray = ref([]);
 const regions = [
    {value:"afr", 
 label: "Africa"}, 
 {value: "arct",
 label: "Arctic Ocean"},
  {value: "asia",
  label: "Asia", children: 
  [{value: 'far', label: 'Far East (Siberia, Korea)'},
  {value: 'chin', label: "China"},
  {value: 'jap', label: 'Japan'},
{value:'rest', label: 'other Asia'},
]},
  {value: "atl",
  label: "Atlantic Ocean"},
  {value: "eurbig",
  label: "Europe",
children:[{value: 'alp',label:'the Alps'},{value: 'rus', label: 'Russia'},{value: 'eur', label: 'other Europe'}]},
  {value: "norma",
  label: "North America",
children: [{value:'cent', label: "Central America"},
            {value: 'usa', label: "United States", children: [{value: 'ala', label: 'Alaska'},{value: 'us', label: "Other US"}]},
        {value: 'can', label: 'Canada'}]}, 
  {value: "oceania",
  label: "Oceania"}, 
  {value: "pacoc",
    label: "Pacific Ocean"},
  {value: "southam",
  label: "South America"}]


  const datasettypes = [
  { key: "0", name: "biochemistry" },
  { key: "1", name: "biomarker" },
  { key: "2", name: "charcoal" },
  { key: "4", name: "chironomid" },
  { key: "5", name: "cladocera" },
  { key: "6", name: "diatom" },
  { key: "10", name: "dinoflagellates" },
  { key: "11", name: "energy dispersive X-ray spectroscopy (EDS/EDX)" },
  { key: "12", name: "geochemistry" },
  { key: "14", name: "insect" },
  { key: "16", name: "loss-on-ignition" },
  { key: "18", name: "macroinvertebrate" },
  { key: "19", name: "DNA" },
  { key: "21", name: "modern biochemistry" },
  { key: "22", name: "organic carbon" },
  { key: "23", name: "ostracode" },
  { key: "24", name: "ostracode surface sample" },
  { key: "25", name: "paleomagnetic" },
  { key: "26", name: "physical sedimentology" },
  { key: "27", name: "phytolith" },
  { key: "28", name: "plant macrofossil" },
  { key: "29", name: "pollen" },
  { key: "32", name: "specimen stable isotope" },
  { key: "33", name: "stable isotope" },
  { key: "34", name: "testate amoebae" },
  { key: "36", name: "vertebrate fauna" },
  { key: "37", name: "water chemistry" },
  { key: "38", name: "X-ray diffraction (XRD)" },
  { key: "39", name: "X-ray fluorescence (XRF)" }
];



const depenvs = [
  { key: '0', name: "from a midden" },
  {key : '1', name: 'other'}
]

const times = [
  { key: '0', name: "modern (post 1850 AD)" },
  { key: '1', name: "holocene" },
  { key: '2', name: "pleistocene" },
  { key: '3', name: "pre-pleistocene" }]


const selectedCityComputed = computed(() => {
  return selectedCountry.value;
});

console.log(selectedCityComputed)

watch([selectedCountry,selecteddata,selectedtimes, selectedenv], () => {
    if(selectedCountry.value != null) {
  console.log(selectedCountry.value.value)}
  if(selecteddata.value != null) {
  console.log(selecteddata.value)}
  if(selectedtimes.value != null) {
  console.log(selectedtimes.value)}
  if(selectedenv.value != null) {
  console.log(selectedenv.value)}

  dbPicker(selectedCountry.value,selecteddata.value,selectedtimes.value, selectedenv.value)
});


function dbPicker(region, data, time, env) {
    let quaternary = ['holocene', 'modern (post 1850 AD)', 'pleistocene']
    let middenies = ['plant macrofossil','vertebrate fauna', 'pollen']
    if (data != null) {
    data = Object.values(data)}
    if (time != null) {
    time = Object.values(time)}
    if (data != null && time != null) {
    if (data.includes("pollen") && time.includes("pre-pleistocene")) {
        recArray.value.push("If you have pollen from before the Pleistocene, you could put that in the Deep Time Palynological Database.") 
}
if (!data.includes("pollen") || !time.includes("pre-pleistocene")) {
        const indexToRemove = recArray.value.indexOf("If you have pollen from before the Pleistocene, you could put that in the Deep Time Palynological Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}

if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && region.value == "eur") {
        recArray.value.push("If you have Quaternary pollen from Europe, you could put that in the European Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from Europe, you could put that in the European Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && region.value == "alp") {
        recArray.value.push("If you have Quaternary pollen from the Alps, you could put that to the Alpine Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from the Alps, you could put that to the Alpine Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && region.value == "afr") {
        recArray.value.push("If you have Quaternary pollen from Africa, you could put that to the African Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from Africa, you could put that to the African Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null && env != null) {
    if (data.some(item => middenies.includes(item)) && env.includes("from a midden")) {
        recArray.value.push("If you have pollen, plant macrofossil, or vertebrate data from a midden, you could put that in the Neotoma Midden Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have pollen, plant macrofossil, or vertebrate data from a midden, you could put that in the Neotoma Midden Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}




if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && (region.value == "oceania" || region.value == "pacoc")) {
        recArray.value.push("If you have Quaternary pollen from the Indo-Pacific region, you could upload that to the Indo-Pacific Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from the Indo-Pacific region, you could upload that to the Indo-Pacific Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && (region.value == "jap")) {
        recArray.value.push("If you have Quaternary pollen from Japan, you could upload that to the Japanese Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from Japan, you could upload that to the Japanese Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && (region.value == "chin")) {
        recArray.value.push("If you have Quaternary pollen from China, you could upload that to the Chinese Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from China, you could upload that to the Chinese Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}




if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && (region.value == "cent" || region.value == "southam")) {
        recArray.value.push("If you have Quaternary pollen from Latin America, you could upload that to the Latin American Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from Latin America, you could upload that to the Latin American Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && (region.value == "us" || region.value == "can" || region.value == 'ala')) {
        recArray.value.push("If you have Quaternary pollen from North America, you could upload that to the North American Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from North America, you could upload that to the North American Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && (region.value == "rus" || region.value == "far")) {
        recArray.value.push("If you have Quaternary pollen from Russia or the far East, you could upload that to the Pollen Database of Siberia and the Russian Far East.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from Russia or the far East, you could upload that to the Pollen Database of Siberia and the Russian Far East.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null && time != null && region != null) {
    if (data.includes("pollen") && time.some(item => quaternary.includes(item)) && (region.value == "can")) {
        recArray.value.push("If you have Quaternary pollen from Canada, you could upload that to the Canadian Pollen Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have Quaternary pollen from Canada, you could upload that to the Canadian Pollen Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null && region != null) {
    if (data.includes("vertebrate fauna") && (region.value == "can" || region.value == "us" || region.value == "ala")) {
        recArray.value.push("If you have vertebrate data from North America, you could upload that to FAUNMAP.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have vertebrate data from North America, you could upload that to FAUNMAP.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null && region != null) {
    if (data.includes("vertebrate fauna") && (region.value == "cent" || region.value == "southam")) {
        recArray.value.push("If you have vertebrate data from Latin America, you could upload that to PaleoVertebrates of Latin America.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have vertebrate data from Latin America, you could upload that to PaleoVertebrates of Latin America.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null && region != null) {
    if (data.includes("vertebrate fauna") && (region.value == "ala")) {
        recArray.value.push("If you have vertebrate data from Alaska, you could upload that to Alaskan Archaeofaunas.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have vertebrate data from Alaska, you could upload that to Alaskan Archaeofaunas.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null && region != null) {
    if (data.includes("plant macrofossil") && (region.value == "can" || region.value == "us" || region.value == "ala")) {
        recArray.value.push("If you have plant macrofossil data from North America, you could upload that to the North American Plant Macrofossil Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have plant macrofossil data from North America, you could upload that to the North American Plant Macrofossil Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null && region != null) {
    if (data.includes("diatom") && region != "southam") {
        recArray.value.push("If you have diatom data (or water chemistry data associated with those diatoms), you could upload that to the Diatom Paleolimnology Data Cooperative or the Academy of Natural Sciences of Drexel University.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have diatom data (or water chemistry data associated with those diatoms), you could upload that to the Diatom Paleolimnology Data Cooperative or the Academy of Natural Sciences of Drexel University.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null && region != null) {
    if (data.includes("diatom") && region == "southam") {
        recArray.value.push("If you have diatom data (or water chemistry data associated with those diatoms) from South America, you could upload that to the Tropical South American Diatom Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have diatom data (or water chemistry data associated with those diatoms) from South America, you could upload that to the Tropical South American Diatom Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null) {
    if (data.includes("DNA")) {
        recArray.value.push("If you have DNA data, you could upload that to the Sedimentary aDNA Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have DNA data, you could upload that to the Sedimentary aDNA Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null) {
    if (data.includes("dinoflagellates")) {
        recArray.value.push("If you have dinoflagellate data, you could upload that to the Marine Dinoflagellates Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have dinoflagellate data, you could upload that to the Marine Dinoflagellates Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null) {
    if (data.includes("testate amoebae")) {
        recArray.value.push("If you have testate amoebae data, you could upload that to the Neotoma Testate Amoebae Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have testate amoebae data, you could upload that to the Neotoma Testate Amoebae Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null) {
    if (data.includes("biomarker")) {
        recArray.value.push("If you have biomarker data, you could upload that to the Neotoma Biomarker Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have biomarker data, you could upload that to the Neotoma Biomarker Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null) {
    if (data.includes("ostracode")) {
        recArray.value.push("If you have ostracode data, you could upload that to the Neotoma Ostracode Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have ostracode data, you could upload that to the Neotoma Ostracode Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null) {
    if (data.includes("specimen stable isotope")) {
        recArray.value.push("If you have stable isotope data derived from vertebrates, you could upload those datasets to the Faunal Isotope Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have stable isotope data derived from vertebrates, you could upload those datasets to the Faunal Isotope Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}


if (data != null) {
    if (data.includes("charcoal")) {
        recArray.value.push("If you have charcoal data, you could upload that to Neotoma Charcoal Data.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have charcoal data, you could upload that to Neotoma Charcoal Data.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}





if (data != null && region != null) {
    if (data.includes("ostracode surface sample") && (region.value == "can" || region.value == "ala" || region.value == "us" || region.value == "cent")) {
        recArray.value.push("If you have ostracode surface samples from North America (or associated water chemistry data), you could upload that to the North American Non-Marine Ostracode Database Project (NANODe).") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have ostracode surface samples from North America (or associated water chemistry data), you could upload that to the North American Non-Marine Ostracode Database Project (NANODe).");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null && region != null) {
    if (data.includes("ostracode surface sample") && (region.value == "eur" || region.value == "alp" || region.value == "rus")) {
        recArray.value.push("If you have ostracode surface samples from Europe (or associated water chemistry data), you could upload that to the Nonmarine Ostracod Distribution in Europe Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have ostracode surface samples from Europe (or associated water chemistry data), you could upload that to the Nonmarine Ostracod Distribution in Europe Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}



if (data != null && region != null) {
    if (data.includes("ostracode surface sample") && (region.value == "far" || region.value == "chin" || region.value == "jap" || region.value == "rest")) {
        recArray.value.push("If you have ostracode surface samples from Europe (or associated water chemistry data), you could upload that to the East Asian Nonmarine Ostracod Database.") 
}
else {
        const indexToRemove = recArray.value.indexOf("If you have ostracode surface samples from Europe (or associated water chemistry data), you could upload that to the East Asian Nonmarine Ostracod Database.");
        if (indexToRemove !== -1) {
            recArray.value.splice(indexToRemove, 1);
        }
    }
}

    recArray.value = [... new Set(recArray.value)]

}

</script>

<style scoped>
  .rec-array-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Optional: Align items to the start of each column */
  }

  .rec-item {
    margin-bottom: 10px; /* Optional: Add margin between each row */
  }
</style>

<template>
 
<DatabaseMap2/>

</template>

