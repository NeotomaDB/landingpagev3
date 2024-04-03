<script setup>

import { ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import Panel from 'primevue/panel'
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import ProgressSpinner from 'primevue/progressspinner';


Chart.register(zoomPlugin);

const chartCanvas2 = ref(null);
const cumulativeData = ref([]);
const loading_this = ref(true);
const route = useRoute();
const datasetsDB = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
Chart.defaults.font.size = 20;
let myChart;


function downloadDBSets() {
    return  fetch(neotomaapi + "/v2.0/apps/constdb/datasetuploads?dbid=" + route.params.databaseid,
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(sets => {
        return sets.json();
    })
    .then(setjson => {
        datasetsDB.value = setjson.data;
    })
}


onMounted(async () => {
    await downloadDBSets();

    cumulativeData.value = [];
    let cumulativeValue = 0;
    Object.entries(datasetsDB.value).forEach(([index, obj]) => {
        cumulativeValue += Number(obj.count);
        var month = obj.month
        cumulativeData.value.push({ month, count: cumulativeValue });

    });
    const chartData = cumulativeData.value.map(({ count,month}) => ({
    x: new Date(month).getFullYear() + (new Date(month).getMonth())/12,
    y: count
}));


const myChart2 = new Chart(chartCanvas2.value, {
        type: 'scatter',
       data: {
        datasets: [{
            data: chartData,
            borderColor: 'darkblue',
            showLine: true,
            borderWidth: 1,
            fill: false,
            pointRadius:1
        }]
       },
      options: {
        responsive: true,
      scales: {
        x: {
            ticks: {
                font: {
                    size: 20,
                },
                callback: function(value,index,values) {
                var test = cumulativeData.value.map(entry => entry.date)[index]
                var year = Math.floor(value);
                var decimal = value - Math.floor(value);
                var month = Math.floor(decimal*12)  + 1
                var day = Math.round((decimal*12 - Math.floor(decimal*12))*30) + 1
                return  "" + month + "/" + day + "/" + year},
                
            },
            title: {
                display: true,
                text: 'Date Contributed' 
            }
        },
        y: {
            title: {
                display: true,
                text: 'Cumulative Uploads' 
            }
        }
    },
      elements: {
                    point:{
                        radius: 0
                    }
                },
      plugins: {
        legend: {
          display: false 
      },
      zoom: {
            pan: {
                enabled: true,
                mode: 'xy',

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

}  )




});


loading_this.value = false

</script>

<template>
<div>
    <div v-if="loading_this" class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />

    </div>
    <Panel toggleable>
        <template #header>
          <h2>Datasets</h2>
        </template>
            <h3>Cumulative Dataset Uploads by Month</h3>
            <canvas ref="chartCanvas2" width="400" height="300"></canvas> 
        <div>
  </div>
      </Panel>
      
  </div> 

</template>
