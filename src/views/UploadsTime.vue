<script setup>
import PITable from '@/views/PITable.vue';
import { ref, onMounted, computed } from 'vue';
import {useRoute} from 'vue-router';
import Panel from 'primevue/panel'
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

Chart.register(zoomPlugin);

const chartCanvas2 = ref(null);
const filteredDatasets = ref(null);
const dates = ref(null);
//const datecounts = ref(null);
const values = ref(null);
const cumulativeData = ref([]);
const cumulativeValue = ref(null);
const loading_this = ref(true);
const globalFilter = ref('');
const uniqueSites = ref(null);
const datasets = ref(null);
const datasetids = ref(null);
const datasets_array = ref(null);
const loading_ab = ref(true);
const databaseinfo = ref(null)
const databasekeys = ref(null)
const databasename = ref(null)
const currentDB = ref(null)
const route = useRoute();
const pis = ref(null)
const pis_array = ref(null)
const PIarray = ref(null)
const filteredPIs = ref(null);
const uniquesets = ref(null)
const datasetsDB = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

let myChart;

const props = defineProps(['title'])


function downloadDBSets() {
    return  fetch(neotomaapi + "/v2.0/apps/constdb/datasetuploads?dbid=" + route.params.databaseid,
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(sets => {
        return sets.json();
    })
    .then(setjson => {
        datasetsDB.value = setjson.data;
      //  console.log(new Date(datasetsDB.value[0].month))

    })
}


onMounted(async () => {
    await downloadDBSets();
    
    const filteredPIs = computed(() => {

        return props.title.filter(car => {
        return Object.values(car).some(value =>
        value.toString().toLowerCase().includes(globalFilter.value.toLowerCase())

        
    );
  });
})

  //  console.log(typeof [filteredPIs])
   const chartData_new = datasetsDB.value.map(({ count,month }) => ({
   x: new Date(month).getFullYear() + (new Date(month).getMonth())/12,
   y: count
}))

    cumulativeData.value = [];
    let cumulativeValue = 0;
    Object.entries(datasetsDB.value).forEach(([index, obj]) => {
        cumulativeValue += Number(obj.count);
        //console.log(cumulativeValue)
        var month = obj.month
        cumulativeData.value.push({ month, count: cumulativeValue });

    });
    const chartData = cumulativeData.value.map(({ count,month}) => ({
    x: new Date(month).getFullYear() + (new Date(month).getMonth())/12,
    y: count
}));
Chart.defaults.font.size = 20;

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
                text: 'Monthly Uploads' 
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
<div v-if="!loading_this">
    <Panel toggleable>
        <template #header>
          <h2>Datasets</h2>
        </template>

            <h3>Cumulative Dataset Uploads by Month</h3>
            <canvas ref="chartCanvas2" width="400" height="300"></canvas> 
 
        <PITable />
        <div>
  </div>
      </Panel>
      
  </div> 
 <div v-else class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />

    </div>
</template>

<script>

export default {
  name: 'UploadsTime',

};
</script>
