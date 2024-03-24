<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import ProgressSpinner from 'primevue/progressspinner';

Chart.register(zoomPlugin);
const chartCanvas = ref(null);
const loading = ref(true);
let myChart;



const allAgerange = ref(null);
const props = defineProps(['title'])

allAgerange.value = props.title.flatMap(site =>
          site.site.datasets.flatMap(dataset =>
          dataset.agerange[0]))
          
allAgerange.value = allAgerange.value.filter(agerange => agerange.ageold !== null);
allAgerange.value = allAgerange.value.sort((a, b) => a.ageold - b.ageold);
allAgerange.value = allAgerange.value.map((agerange,index) => ({ ...agerange, index}));

allAgerange.value = {datasets: allAgerange.value.map(agerange => ({
        data: [
          {y: agerange.index, x: agerange.ageyoung },
          {y: agerange.index, x:agerange.ageold}
        ],
        borderWidth: 1,
        borderColor: "darkblue",
        showLine: true,
        pointRadius: 0
      }))}


const chartData = allAgerange.value;



onMounted(() => {
  
  // Create the chart
  myChart = new Chart(chartCanvas.value, {
    type: 'scatter',
    data: chartData,
    options: {
      scales: {
        x: {
            title: {
                display: true,
                text: 'Age (Years)' 
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
}  );

chartData.datasets.forEach((one, index) => {
    let bigdif = (allAgerange.value.datasets[(allAgerange.value.datasets.length-1)].data[1].x - allAgerange.value.datasets[0].data[0].x)

    if (Math.abs(one.data[0].x - one.data[1].x) <= bigdif/216 ) {
        chartData.datasets[index].pointRadius = 1;
        chartData.datasets[index].borderColor = "red"; // Change point radius to 10
    } else {
        chartData.datasets[index].pointRadius = 0; // Change point radius back to 5
    }
});

// Update the chart
myChart.update();


});

loading.value=false
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
  name: 'TempExtent',

};
</script>
