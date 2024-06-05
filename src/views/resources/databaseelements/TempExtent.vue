<script setup>
import { ref, onMounted } from 'vue';
import {useRoute} from 'vue-router';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import ProgressSpinner from 'primevue/progressspinner';
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
const route = useRoute()
const theAges = ref(null);
const theAges2 = ref(null);
Chart.register(zoomPlugin);
const chartCanvas = ref(null);
const loading_temp = ref(true);
let myChart;
const chartReady = ref(false);



const units_count = ref(null);
const units_list = ref(null);

Chart.defaults.plugins.tooltip.enabled = false;

function colorpick(type) {
  if (type == "Calendar years BP") {
      return "green"
    }
    if (type  == "Calibrated radiocarbon years BP") {
      return "darkblue"
    }
    if (type == "Radiocarbon years BP") {
      return "gold"
    }
    if (type == "Calendar years AD/BC") {
      return "violet"
    }
    if (type == "Varve years BP") {
      return "orange"
    }
}

function sizepick(old,young) {
  
  let bigdif = (theAges.value[(theAges.value.length-1)].older - theAges.value[0].younger)

  if ((old - young) <= bigdif/216 ) {
        return 1;
    } else {
       return 0; // Change point radius back to 5
}
}


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


function loadDBages() {
  return  fetch(neotomaapi + "/v2.0/apps/constdb/datasetages?dbid=" + route.params.databaseid,
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      theAges.value = json1.data
      theAges.value = theAges.value.filter(agerange => agerange.older !== null);
      theAges.value = theAges.value.sort((a, b) => a.older - b.older);
      theAges.value = theAges.value.map((agerange,index) => ({ ...agerange, index}));
      units_list.value = theAges.value.map((agerange) => agerange.agetype)
      units_count.value =  theAges.value.reduce((acc, obj) => {
          const unit = obj.agetype
          acc[unit] = (acc[unit] || 0) + 1;
          return acc;}, {});

      theAges2.value = {datasets: theAges.value.map(agerange => ({
        data: [
          {y: agerange.index, x: Math.log10(agerange.younger + 20000)  },
          {y: agerange.index, x: Math.log10(agerange.older + 20000) }
        ],
        borderWidth: 1,
        borderColor: colorpick(agerange.agetype),
        showLine: true,
        pointRadius: sizepick(agerange.older,agerange.younger)
      }))}

      return theAges2.value

})
.then(ages => {
  myChart = new Chart(chartCanvas.value, {
    type: 'scatter',
    data: ages,
    options: {
      scales: {
        x: {
          ticks: {
            callback: function(value,index,values) {
                var newLab = Math.pow(10,value) - 20000;
                if (newLab < 0) {
                var sizer = String(Math.round(newLab)).length - 1
              }
              if (newLab >= 0) {
                var sizer = String(Math.round(newLab)).length
              }
              sizer = Math.pow(10,sizer)/1000
              if (sizer < 1) {sizer = 1}
                newLab = addCommasToNumber(Math.round(newLab/sizer)*sizer)
                return  newLab + " "}
          },
            title: {
                display: true,
                text: 'Age (Years)',
                fontSize: 15
            }
        },
        y: {
            title: {
                display: true,
                text: 'Dataset Index' 
            }
        }
    },
      elements: {
                    point:{
                        radius: 0
                    }
                },
      plugins: {
        tooltips: {
            enabled: false // Disable tooltips
        },
        legend: {
          display: false 
      },
      zoom: {
            pan: {
              enabled: true,
              mode: 'xy'
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true
                },
                mode: 'xy'
            }
        }
    }
  }

  
}  );

chartReady.value = true
console.log(Chart.version)

});
}


onMounted(async () => {
  await loadDBages();
  

}  );

loading_temp.value =false

</script>


<template>
  <div v-if="!loading_temp">
    <div v-if="!chartReady" class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <canvas ref="chartCanvas" width="400" height="300"></canvas>
    <p style="margin-bottom:0px;margin-top:0px;"><span style="color:darkblue;font-weight:bold;">dark blue</span> 
    points are in units of <strong style="color:darkblue">Calibrated radiocarbon Years BP</strong>;</p>
    <p style="margin-bottom:0px;margin-top:0px;"><span style="color:gold;font-weight:bold;">gold</span> 
    points are in units of <strong style="color:gold">Radiocarbon Years BP</strong>;</p>
    <p style="margin-bottom:0px;margin-top:0px;"><span style="color:green;font-weight:bold;">green</span> 
      points are in units of <strong style="color:green">Calendar Years BP</strong>;</p>
    <p style="margin-bottom:0px;margin-top:0px;"><span style="color:violet;font-weight:bold;">violet</span> 
      points are in units of <strong style="color:violet">Calendar Years AD/BC</strong>; and </p>
      <p style="margin-bottom:0px;margin-top:0px;"><span style="color:orange;font-weight:bold;">orange</span> 
      points are in units of <strong style="color:orange">Varve Years BP</strong>.</p>
  </div>

</template>

