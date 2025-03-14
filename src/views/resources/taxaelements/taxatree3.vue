<template>
    <div class="app">
      <TreeChart :data="treeData" />
    </div>
  </template>

  <script>
  import TreeChart from './taxatree2.vue';

  export default {
    name: 'App',
    components: {
      TreeChart
    },
    data() {
      return {
        treeData: {
          name: 'Root',
          children: [
            { name: 'Child 1' },
            {
              name: 'Child 2',
              children: [
                { name: 'Grandchild 1' },
                { name: 'Grandchild 2' }
              ]
            }
          ]
        }
      }
    }
  }
  </script>

  <style scoped>
  .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 2px;
  }

  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 1.5px;
  }

  .node text {
    font: 12px sans-serif;
  }
  </style>