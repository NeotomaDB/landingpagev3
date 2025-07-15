<script setup>
import { ref,onMounted} from 'vue';
import {useRoute} from 'vue-router';

import VueTree from "@ssthouse/vue3-tree-chart";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";

const route = useRoute()
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

const sampleData = {
        value: '1',
        children: [
          { value: '2', children: [{ value: '4' }, { value: '5' }] },
          { value: '3' }
        ]
      }

const treeConfig = { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 }

</script>

<template>
  <div class="container">
    <vue-tree
      style="width: 800px; height: 600px; border: 1px solid gray;"
      :dataset="sampleData"
      :config="treeConfig"
    >
    </vue-tree>
  </div>
</template>


<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>