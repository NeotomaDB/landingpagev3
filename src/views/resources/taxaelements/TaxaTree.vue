<script setup>
import { ref,onMounted} from 'vue';
import {useRoute} from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner';
import Panel from 'primevue/panel';
import VueTree from "@ssthouse/vue3-tree-chart";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";
const route = useRoute()
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
const alltaxa = ref(null);
const high1 = ref(null);
const high2 = ref(null);
const high3 = ref(null);
const taxon = ref(null);
const taxname = ref(null);
const adelphi = ref([]);
const adelphi1 = ref([]);
const adelphi2 = ref([]);
const low1s = ref([]);
const allbros = ref(null);
const nestedtree = ref(null);
const loader = ref(false);
const treeConfig = { nodeWidth: 120, nodeHeight: 30, levelHeight: 200 }

function sortTreeByChildrenCount(nodes) {
    if (!Array.isArray(nodes)) return [];

    // Sort nodes by number of children in descending order
    nodes.sort((a, b) => (b.children?.length || 0) - (a.children?.length || 0));

    // Reorder nodes to put the one with most children in the middle
    let reordered = [];
    while (nodes.length) {
        if (reordered.length % 2 === 0) {
            reordered.push(nodes.shift()); // Take from the start
        } else {
            reordered.unshift(nodes.shift()); // Take from the start, but place at the beginning
        }
    }

    // Recursively apply this function to each node's children
    reordered.forEach(node => {
        if (node.children) {
            node.children = sortTreeByChildrenCount(node.children);
        }
    });

    return reordered;
}

function loadTree() {
  return fetch(neotomaapi + "/v2.0/data/dbtables/taxa?count=false&limit=999999&offset=0",
  { method: "GET", headers: {'content-type': 'application/json'} })
  .then(res1 => {
     return res1.json() })
  .then(json1 => {
    alltaxa.value = json1.data;
    taxon.value = alltaxa.value.find(obj => obj.taxonid == route.params.taxonid);
    taxname.value = taxon.value.taxonname;
    high1.value = alltaxa.value.find(obj => obj.taxonid == taxon.value.highertaxonid);
    high2.value = alltaxa.value.find(obj => obj.taxonid == high1.value.highertaxonid);
    high3.value = alltaxa.value.find(obj => obj.taxonid == high2.value.highertaxonid);
    low1s.value = alltaxa.value.filter(obj => obj.highertaxonid == taxon.value.taxonid);
    adelphi.value = alltaxa.value.filter(obj => obj.highertaxonid == taxon.value.highertaxonid);
    adelphi1.value = alltaxa.value.filter(obj => obj.highertaxonid == high1.value.highertaxonid);
    adelphi2.value = alltaxa.value.filter(obj => obj.highertaxonid == high2.value.highertaxonid);
    allbros.value = adelphi.value.concat(adelphi1.value,adelphi2.value,high3.value,low1s.value)
    console.log(high3.value)

  })
}

function buildTree() {
  let map = new Map();
  allbros.value.forEach(item => {
    map.set(item.taxonid, {
      value: item.taxonname,
      data: "https://data.neotomadb.org/taxa/" + item.taxonid,
      children: []
    });
  });

  let tree = [];
  allbros.value.forEach(item => {
    if (item.highertaxonid === item.taxonid) {
      // If a taxon is its own higher taxon, treat it as a root node
      tree.push(map.get(item.taxonid));
    } else if (map.has(item.highertaxonid)) {
      // Otherwise, assign it as a child of its parent
      map.get(item.highertaxonid).children.push(map.get(item.taxonid));
    } else {
      // If no valid parent is found, add it to the tree
      tree.push(map.get(item.taxonid));
    }
  });
  nestedtree.value = sortTreeByChildrenCount(tree);
  loader.value = true;
  console.log(taxon.value);
}

onMounted(async () => {
    await loadTree();
    await buildTree();
})

</script>

<style scoped>
::v-deep(.tree-container .link) {
  stroke: #8a8578 !important;
}

::v-deep(a) {
  color: #1D5183;
}

::v-deep(#tree_id a) {
  background-color: rgba(226, 225, 221, 0.8);
  width:100%;
  text-align:center;
  border-radius:1000px;
}

::v-deep(.p-panel-content) {
  padding: 0px;
}

::v-deep(.p-panel .p-panel-content) {
  padding: 0px;
}
::v-deep(#tree_id) {
  padding: 0px;
}
</style>

<template>
  <Panel id="tree_id" toggleable>
    <template #header >
      <h2>{{taxname}} Taxonomic Tree</h2>
    </template>

    <div v-if="!loader" class="flex flex-wrap justify-content-center align-items-center">
      <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <div id="me" v-else> 
<vue-tree
      style="width: 100%; height: 600px; border: 1px solid gray;"
      :dataset="nestedtree"
      :config="treeConfig"
      :collapse-enabled=false
    >

    <template v-slot:node="{ node }">
        <a
          class="tree-node"
          :style="{ fontWeight: node.value == taxon.taxonname ? '900' : ''}"
          :href = "(node.data)"
          target="_blank"
          >{{ node.value }}</a>
      </template>
    </vue-tree>
  </div>
</Panel>
 </template>

