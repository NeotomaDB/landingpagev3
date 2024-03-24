<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import ProgressSpinner from 'primevue/progressspinner';

const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
Chart.register(zoomPlugin);
const chartCanvas = ref(null);
const filteredDatasets = ref(null);
const dates = ref(null);
//const datecounts = ref(null);
const values = ref(null);
const cumulativeData = ref([]);
const cumulativeValue = ref(null);
const loading = ref(true);
let myChart;

var options = {
    scales: {
        xAxes: [{
            type: 'linear',
            // ...
        }]
    }
}

const props = defineProps(['title'])

function downloadDatasets() {
    return  fetch(neotomaapi + "/v2.0/data/dbtables/datasets?limit=55000&offset=0",
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      filteredDatasets.value = json1.data.filter(dataset => props.title.includes(dataset.datasetid));
      filteredDatasets.value = filteredDatasets.value.map(set => new Date(set.recdatecreated))
      filteredDatasets.value = filteredDatasets.value.sort((a, b) => a - b);
      filteredDatasets.value =  filteredDatasets.value.map(dateTime => {
        const date = new Date(dateTime);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
});
     
      return filteredDatasets.value
    })
}

function count() {
    if (!filteredDatasets.value || !datecounts.value) {
        return;
    }
    filteredDatasets.value.forEach(date => {
    // Convert the date to a string representation to use it as a key in the object
            const dateString = date.toISOString().split('T')[0]; // Convert date to string in YYYY-MM-DD format

    // If the date exists as a key in the object, increment its count
            if (datecounts[dateString]) {
                datecounts[dateString]++;
            } else {
        // If the date doesn't exist as a key, initialize its count to 1
                datecounts[dateString] = 1;
    }
});
    console.log(datecounts)
    cumulativeData.value = [];
    let cumulativeValue = 0;
    Object.entries(datecounts.value).forEach(([date, value]) => {
       // const date = Object.keys(entry)[0];
       // const value = entry[date];

        cumulativeValue += value;
        cumulativeData.value.push({ date, value: cumulativeValue });
    });
    console.log(cumulativeData)
    return cumulativeData.value
}





onMounted(async () => {
    await downloadDatasets();
    let count = 0;
    const dateCounts = {};
    filteredDatasets.value.forEach(date => {
        const dateString = date.toISOString().split('T')[0];

        if(dateCounts[dateString]) {
            dateCounts[dateString]++;
        }
         else {
        // If the date doesn't exist as a key, initialize its count to 1
                dateCounts[dateString] = 1;
    }
});
    console.log(dateCounts)
    cumulativeData.value = [];
    let cumulativeValue = 0;
    Object.entries(dateCounts).forEach(([date, value]) => {
        cumulativeValue += value;
        cumulativeData.value.push({ date, value: cumulativeValue });
        console.log(date)
    });

    const dates = cumulativeData.value.map(entry => new Date(entry.date));
    const numdates = dates.map(entry => entry.getFullYear() + (entry.getMonth())/12 + (entry.getDate())/365)
    const values = cumulativeData.value.map(entry => entry.value);
    const chartData = cumulativeData.value.map(({ date,value }) => ({
    x: new Date(date).getFullYear() + (new Date(date).getMonth())/12 + (new Date(date).getDate())/365,
    y: value
}));
    console.log(chartData)

    const myChart = new Chart(chartCanvas.value, {
        type: 'scatter',
       data: {
       // labels: cumulativeData.value.map(entry => entry.date),
        datasets: [{
            data: chartData,
            borderColor: 'darkblue',
            showLine: true,
            borderWidth: 1,
            fill: false
        }]
       },
      options: {
      scales: {
        x: {
            ticks: {
                callback: function(value,index,values) {
                var test = cumulativeData.value.map(entry => entry.date)[index]
                var year = Math.floor(value);
                var decimal = value - Math.floor(value);
                var month = Math.floor(decimal*12)  + 1
                var day = Math.round((decimal*12 - Math.floor(decimal*12))*30) + 1
                return  "" + month + "/" + day + "/" + year}
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

loading.value = false
</script>

<template>
<div v-if="!loading">
    <canvas ref="chartCanvas" width="400" height="300"></canvas> 
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
